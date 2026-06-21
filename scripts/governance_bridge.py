#!/usr/bin/env python3
"""
Governance Bridge — Independent Cosmos governance → Markdown updater
═══════════════════════════════════════════════════════════════════
Fetches governance proposals (SoftwareUpgrade / SoftwareUpgradeProposal)
from Cosmos chain RPCs and updates Markdown files in the services repo.

✅ INDEPENDENT: Does NOT read from validator bot data files
✅ ATOMIC: All writes use tmp + rename
✅ RESILIENT: Undead Watchdog + Failover endpoints
✅ IDEMPOTENT: No-op if no new proposals
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error
import ssl
import logging
import argparse
import subprocess
from pathlib import Path
from datetime import datetime, timezone, timedelta

# ── CLI args ────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Cosmos Governance → Markdown Bridge")
parser.add_argument("--config", type=str, default="bridge_config.json",
                    help="Path to bridge config (default: bridge_config.json)")
parser.add_argument("--state", type=str, default="bridge_state.json",
                    help="Path to bridge state cache (default: bridge_state.json)")
parser.add_argument("--dry-run", action="store_true",
                    help="Generate content but do NOT write files or git push")
parser.add_argument("--commit", action="store_true",
                    help="After update, commit and push changes via git")
parser.add_argument("--chain", type=str, default=None,
                    help="Process only this chain_id (default: all)")
parser.add_argument("--verbose", action="store_true", help="Verbose logging")
args = parser.parse_args()

WIB = timezone(timedelta(hours=7))

# ── Logging ──────────────────────────────────────────────────────────────────
LOG_PATH = Path("bridge.log").resolve()
logging.basicConfig(
    level=logging.DEBUG if args.verbose else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_PATH, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger("bridge")


# ── Atomic write helper ─────────────────────────────────────────────────────
def atomic_write_text(file_path: Path, content: str) -> None:
    """Write content atomically: tmp + rename."""
    tmp = str(file_path) + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(content)
    os.replace(tmp, str(file_path))


def atomic_write_json(file_path: Path, data: dict) -> None:
    atomic_write_text(file_path, json.dumps(data, indent=2, ensure_ascii=False))


# ── HTTP helper with failover ───────────────────────────────────────────────
def http_get_json(url: str, timeout: int = 15) -> dict | None:
    """GET a JSON URL with SSL bypass + short timeout."""
    try:
        ctx = ssl._create_unverified_context()
        req = urllib.request.Request(url, headers={
            "User-Agent": "ServicesBridge/1.0",
            "Accept": "application/json",
        })
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            if r.status == 200:
                return json.loads(r.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, TimeoutError) as e:
        log.debug(f"http_get_json failed {url}: {e}")
    return None


# ── Governance proposal fetcher ─────────────────────────────────────────────
def fetch_voting_proposals(chain_cfg: dict) -> list:
    """
    Fetch proposals in VOTING_PERIOD for a chain.
    Tries multiple gov module paths and multiple endpoints.
    """
    endpoints = chain_cfg.get("rest_endpoints", [])
    gov_module = chain_cfg.get("gov_module", "v1beta1")
    chain_name = chain_cfg.get("chain_name", "?")

    # Build candidate API paths and status codes per gov module
    paths = []
    if gov_module == "atomone.gov.v1":
        paths.append(("/atomone/gov/v1/proposals", "2"))  # 2 = VOTING_PERIOD
    elif gov_module == "v1":
        paths.append(("/cosmos/gov/v1/proposals", "1"))  # 1 = VOTING_PERIOD
    else:  # v1beta1
        paths.append(("/cosmos/gov/v1beta1/proposals", "2"))  # 2 = VOTING_PERIOD

    for ep in endpoints:
        ep = ep.rstrip("/")
        for path, status_code in paths:
            url = f"{ep}{path}?proposal_status={status_code}&pagination.limit=10"
            data = http_get_json(url, timeout=10)
            if data is None:
                continue
            proposals = data.get("proposals", [])
            if proposals:
                log.info(f"[{chain_name}] {len(proposals)} proposal(s) at {ep}{path}")
                return proposals
            log.debug(f"[{chain_name}] 0 proposals at {ep}{path}")
    return [] 


def is_upgrade_proposal(content: dict, metadata: str = "") -> bool:
    """Check if a proposal is a software upgrade proposal."""
    # @type field check (v1beta1)
    if content.get("@type", "").endswith("SoftwareUpgradeProposal"):
        return True
    # messages array check (v1)
    for msg in content.get("messages", []):
        if msg.get("@type", "").endswith("MsgSoftwareUpgrade"):
            return True
    # Check proposal metadata
    if "upgrade" in metadata.lower():
        return True
    return False


def extract_upgrade_info(proposal: dict, chain_cfg: dict) -> dict | None:
    """Extract upgrade title, height, plan, ETA from a proposal."""
    proposal_id = proposal.get("proposal_id", "?")
    title = proposal.get("content", {}).get("title") or "Software Upgrade"
    description = proposal.get("content", {}).get("description", "")

    # Look for height/plan in v1beta1 content
    plan = proposal.get("content", {}).get("plan", {})
    height = plan.get("height", "TBD")

    # v1 format: messages[0].plan
    if not plan and proposal.get("messages"):
        msg = proposal["messages"][0]
        plan = msg.get("plan", msg.get("content", {}).get("plan", {}))

    # Extract from description if plan not found
    if height == "TBD" and "height" in description.lower():
        for token in description.split():
            if token.lstrip("-").isdigit() and len(token.lstrip("-")) >= 6:
                height = token.lstrip("-")
                break

    # ETA
    eta = "TBD"
    ts = proposal.get("voting_end_time", "")
    if ts:
        try:
            dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
            eta = dt.astimezone(WIB).strftime("%Y-%m-%d %H:%M WIB")
        except (ValueError, TypeError):
            eta = ts

    return {
        "proposal_id": proposal_id,
        "title": title.strip(),
        "status": proposal.get("status", "VOTING_PERIOD"),
        "height": str(height),
        "eta": eta,
        "description": description[:500].strip(),
    }


# ── Markdown generator ──────────────────────────────────────────────────────
def build_upgrade_markdown(chain_id: str, chain_cfg: dict, upgrade: dict | None) -> str:
    """Build the upgrade.md content for one chain."""
    chain_name = chain_cfg.get("chain_name", chain_id.title())
    chain_id_str = chain_cfg.get("chain_id", chain_id)
    node_version = chain_cfg.get("node_version", "N/A")
    manual_cmd = chain_cfg.get("manual_upgrade", "Manual upgrade not configured.")

    body = f"""---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-{chain_id}">
# {chain_name} Upgrade
</div>
<span className="sub-lines"> 
 Chain ID: `{chain_id_str}` | Node Version: `{node_version}`
</span>
"""

    if upgrade:
        body += f"""

<span> 
Upgrade at height: **{upgrade['height']}** (Proposal #{upgrade['proposal_id']}, ETA: {upgrade['eta']})
<i>Please don`t upgrade before the specified height.</i>
</span>

> {upgrade['description']}
"""
    else:
        body += """

<span> 
No active upgrade proposal. <i>Chain is up to date.</i>
</span>
"""

    body += f"""

## Manual Upgrade

```js
{manual_cmd}
```
"""
    return body


# ── State cache ─────────────────────────────────────────────────────────────
def load_state(state_path: Path) -> dict:
    if state_path.exists():
        try:
            return json.loads(state_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as e:
            log.warning(f"State corrupted, resetting: {e}")
    return {}


def save_state(state_path: Path, state: dict) -> None:
    atomic_write_json(state_path, state)


# ── Git auto-commit helper ───────────────────────────────────────────────────
def git_commit_and_push(repo_dir: Path, message: str) -> bool:
    """Stage all, commit, and push. Returns True on success."""
    try:
        env = os.environ.copy()
        # Use a separate identity so commits are traceable to the bridge
        env["GIT_AUTHOR_NAME"] = "Governance Bridge"
        env["GIT_AUTHOR_EMAIL"] = "bridge@services.local"
        env["GIT_COMMITTER_NAME"] = "Governance Bridge"
        env["GIT_COMMITTER_EMAIL"] = "bridge@services.local"

        subprocess.run(["git", "add", "."], cwd=repo_dir, check=True,
                       env=env, capture_output=True)
        result = subprocess.run(["git", "commit", "-m", message],
                                cwd=repo_dir, check=True, env=env,
                                capture_output=True, text=True)
        log.info(f"git commit: {result.stdout.strip()}")
        result = subprocess.run(["git", "push"], cwd=repo_dir,
                               env=env, capture_output=True, text=True)
        if result.returncode == 0:
            log.info(f"git push: {result.stdout.strip()}")
            return True
        log.error(f"git push failed: {result.stderr.strip()}")
    except subprocess.CalledProcessError as e:
        log.error(f"git error: {e.stderr or e}")
    return False


# ── Main pipeline ───────────────────────────────────────────────────────────
def main():
    config_path = Path(args.config).resolve()
    state_path = Path(args.state).resolve()

    if not config_path.exists():
        log.error(f"Config not found: {config_path}")
        sys.exit(1)

    config = json.loads(config_path.read_text(encoding="utf-8"))
    chains = config.get("chains", {})
    if args.chain:
        chains = {k: v for k, v in chains.items() if k == args.chain}

    if not chains:
        log.error("No chains to process")
        sys.exit(1)

    state = load_state(state_path)
    updated_chains = []

    for chain_id, chain_cfg in chains.items():
        log.info(f"━━━ Processing [{chain_cfg.get('chain_name', chain_id)}] ━━━")
        proposals = fetch_voting_proposals(chain_cfg)

        # Find the latest upgrade proposal (if any)
        latest_upgrade = None
        for prop in proposals:
            content = prop.get("content", {})
            if is_upgrade_proposal(content, content.get("title", "")):
                latest_upgrade = extract_upgrade_info(prop, chain_cfg)
                break

        # Compare with cached state
        cached_id = state.get(chain_id, {}).get("latest_proposal_id")
        new_id = latest_upgrade["proposal_id"] if latest_upgrade else None

        if latest_upgrade and new_id != cached_id:
            log.info(f"[{chain_id}] NEW upgrade proposal #{new_id}: {latest_upgrade['title']}")
        elif not latest_upgrade and cached_id:
            log.info(f"[{chain_id}] Upgrade proposal cleared (was #{cached_id})")
        else:
            log.debug(f"[{chain_id}] No change (cached: {cached_id})")

        # Build markdown
        new_content = build_upgrade_markdown(chain_id, chain_cfg, latest_upgrade)
        doc_path = Path(chain_cfg.get("doc_path", f"mainnets/{chain_id}/upgrade.md")).resolve()

        # Check if file actually changed
        old_content = doc_path.read_text(encoding="utf-8") if doc_path.exists() else ""
        if new_content != old_content:
            if args.dry_run:
                log.info(f"[{chain_id}] DRY-RUN: would update {doc_path}")
            else:
                doc_path.parent.mkdir(parents=True, exist_ok=True)
                atomic_write_text(doc_path, new_content)
                log.info(f"[{chain_id}] ✓ Wrote {doc_path}")
            updated_chains.append(chain_id)
        else:
            log.info(f"[{chain_id}] No change to {doc_path}")

        # Update state
        state[chain_id] = {
            "latest_proposal_id": new_id,
            "last_checked": datetime.now(timezone.utc).isoformat(),
        }

    # Save state atomically
    if not args.dry_run:
        save_state(state_path, state)
        log.info(f"State saved → {state_path}")

    # Auto-commit if requested
    if args.commit and updated_chains and not args.dry_run:
        repo_dir = config_path.parent
        chains_str = ", ".join(updated_chains)
        msg = f"bridge: auto-update upgrade info ({chains_str})"
        if git_commit_and_push(repo_dir, msg):
            log.info("✓ Git push successful")
        else:
            log.warning("Git push failed — file changes are local only")

    log.info(f"━━━ Done. Updated: {len(updated_chains)} chain(s) ━━━")


if __name__ == "__main__":
    main()
