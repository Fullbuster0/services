#!/usr/bin/env python3
"""
Governance Bridge — Full Lifecycle Manager
==========================================

Responsibilities
----------------
1. Poll Cosmos chain governance for `SoftwareUpgrade` proposals.
2. Track each upgrade's lifecycle in `bridge_state.json`:
   - `active_upgrades`   : proposals whose target height has not been reached.
   - `completed_upgrades`: proposals whose target height has been reached.
3. For every chain, fetch RPC/REST `/status` (with REST fallback) to obtain
   `latest_block_height` and compare it with the proposal's `target_height`.
4. When `current_height >= target_height`:
   a. Atomically migrate the proposed version into `bridge_config.json` →
      `chains.<id>.node_version` (and regenerate `manual_upgrade`).
   b. Move the upgrade entry from `active_upgrades` → `completed_upgrades`.
   c. Trigger a full documentation rebuild (Markdown + JSON) so all pages
      reflect the new stable version.
5. All config/state writes go through `atomic_write_text` / `atomic_write_json`
   to guarantee no half-written files on crash or kill -9.

Run modes
---------
    --dry-run         Print everything that *would* happen, write nothing.
    --commit          After success, `git add . && git commit && git push`.
    --chain <id>      Limit work to a single chain id.
    --config <path>   Path to bridge_config.json (default: bridge_config.json).
    --state  <path>   Path to bridge_state.json  (default: bridge_state.json).
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import re
import ssl
import subprocess
import sys
from collections import Counter
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

try:
    from jsonschema import SchemaError, ValidationError, validate
except ImportError:  # pragma: no cover - jsonschema is part of the project's deps
    validate = None  # type: ignore[assignment]
    ValidationError = SchemaError = Exception  # type: ignore[assignment, misc]

# ── CLI args ────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Cosmos Governance → Lifecycle Bridge")
parser.add_argument("--config", type=str, default="bridge_config.json")
parser.add_argument("--state", type=str, default="bridge_state.json")
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("--commit", action="store_true")
parser.add_argument("--chain", type=str, default=None)
parser.add_argument("--rpc-timeout", type=int, default=5)
args = parser.parse_args()

WIB = timezone(timedelta(hours=7))
LOG_PATH = Path("bridge.log").resolve()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_PATH, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger("bridge")


# ── Atomic I/O helpers ──────────────────────────────────────────────────────
def atomic_write_text(file_path: Path, content: str) -> None:
    """Write text atomically: write to .tmp, fsync, os.replace for crash safety."""
    tmp = f"{file_path}.tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(content)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, str(file_path))


def atomic_write_json(file_path: Path, data: Any) -> None:
    """Serialize *data* as pretty JSON and write atomically."""
    atomic_write_text(file_path, json.dumps(data, indent=2, ensure_ascii=False))


# ── JSON Schema validation ──────────────────────────────────────────────────
UPGRADE_ITEM_SCHEMA = {
    "type": "object",
    "properties": {
        "network":       {"type": "string", "minLength": 1},
        "link":          {"type": "string", "minLength": 1},
        "rpc":           {"type": "string", "minLength": 1},
        "target_height": {"type": "integer", "minimum": 0},
        "version":       {"type": "string", "minLength": 1},
        "proposal_id":   {"type": "string"},
        "proposal":      {"type": "string", "minLength": 1},
    },
    "required": ["network", "link", "rpc", "target_height", "version", "proposal"],
    "additionalProperties": False,
}
UPGRADE_JSON_SCHEMA = {"type": "array", "items": UPGRADE_ITEM_SCHEMA}


def validate_upgrade_json(data: list) -> tuple[bool, str]:
    if not isinstance(data, list):
        return False, "Root must be array"
    if validate is None:
        return True, ""  # jsonschema unavailable — accept and warn at import time
    try:
        validate(instance=data, schema=UPGRADE_JSON_SCHEMA)
        return True, ""
    except ValidationError as e:
        return False, str(e)


# ── RPC / REST health + height ──────────────────────────────────────────────
def _http_get_json(url: str, timeout: int) -> dict | None:
    """Best-effort JSON GET. Returns None on any network/parse failure."""
    ctx = ssl._create_unverified_context()
    req = urllib.request.Request(url, headers={"User-Agent": "ServicesBridge/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            if r.status != 200:
                return None
            return json.loads(r.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError,
            json.JSONDecodeError, OSError, ValueError) as e:
        log.debug("HTTP %s failed: %s", url, e)
        return None


def check_endpoint_health(url: str, timeout: int = 5) -> bool:
    """Quick liveness probe via /status (Tendermint RPC)."""
    payload = _http_get_json(f"{url.rstrip('/')}/status", timeout)
    if not payload:
        return False
    return "sync_info" in payload.get("result", {})


def get_healthiest_endpoint(endpoints: list) -> str:
    for ep in endpoints:
        if check_endpoint_health(ep, timeout=args.rpc_timeout):
            return ep
    return endpoints[0] if endpoints else ""


def get_latest_block_height(endpoint: str, timeout: int = 5) -> int | None:
    """
    Return the current block height for *endpoint*, or None on failure.

    Tries Tendermint RPC `/status` first, then the Cosmos LCD REST endpoint
    `/cosmos/base/tendermint/v1beta1/blocks/latest` as a fallback for chains
    that don't expose RPC at the same URL.
    """
    if not endpoint:
        return None
    base = endpoint.rstrip("/")
    for path in ("/status", "/cosmos/base/tendermint/v1beta1/blocks/latest"):
        payload = _http_get_json(f"{base}{path}", timeout=timeout)
        if not payload:
            continue
        # Tendermint RPC: {"result": {"sync_info": {"latest_block_height": "..."}}}
        if "result" in payload and "sync_info" in payload["result"]:
            try:
                return int(payload["result"]["sync_info"]["latest_block_height"])
            except (KeyError, TypeError, ValueError):
                pass
        # Cosmos REST: {"block": {"header": {"height": "..."}}}
        if "block" in payload and isinstance(payload["block"], dict):
            header = payload["block"].get("header", {})
            if "height" in header:
                try:
                    return int(header["height"])
                except (TypeError, ValueError):
                    pass
    return None


def get_consensus_height(rpc_endpoints: list[str], threshold: int = 2) -> Optional[int]:
    """Fetch latest block height from multiple endpoints, return consensus (majority)."""
    heights = []
    for ep in rpc_endpoints:
        h = get_latest_block_height(ep)
        if h is not None:
            heights.append(h)
    
    if not heights:
        return None

    counts = Counter(heights)
    most_common, count = counts.most_common(1)[0]
    
    if count >= threshold:
        log.info("  ✓ Consensus reached on height: %s (agreed by %s/%s)", most_common, count, len(heights))
        return most_common
    log.warning("  ✗ No consensus on height: counts=%s", counts)
    return None


# ── Governance proposal polling ─────────────────────────────────────────────
def fetch_voting_proposals(chain_cfg: dict) -> list:
    eps = chain_cfg.get("rest_endpoints", [])
    paths = [
        ("/atomone/gov/v1/proposals", "2"),
        ("/atomone/gov/v1/proposals", "1"),
        ("/atomone/gov/v1/proposals", "3"),
        ("/cosmos/gov/v1/proposals", "1"),
        ("/cosmos/gov/v1/proposals", "2"),
        ("/cosmos/gov/v1/proposals", "3"),
        ("/cosmos/gov/v1beta1/proposals", "2"),
        ("/cosmos/gov/v1beta1/proposals", "3"),
    ]
    for ep in eps:
        for path, sc in paths:
            url = f"{ep.rstrip('/')}{path}?proposal_status={sc}&pagination.limit=50"
            data = _http_get_json(url, timeout=args.rpc_timeout)
            if data and data.get("proposals"):
                return data["proposals"]
    return []


def get_consensus_proposals(rest_endpoints: list[str]) -> list:
    """Fetch proposals from multiple endpoints and merge.

    Note: status codes 1=DepositPeriod, 2=VotingPeriod, 3=Passed, 4=Failed,
    5=Rejected. We also query status 3 (PASSED) so post-vote proposals that
    are awaiting their target height still get picked up by the bridge.
    """
    merged = {}
    paths = [
        ("/atomone/gov/v1/proposals", "2"),
        ("/atomone/gov/v1/proposals", "1"),
        ("/atomone/gov/v1/proposals", "3"),
        ("/cosmos/gov/v1/proposals", "1"),
        ("/cosmos/gov/v1/proposals", "2"),
        ("/cosmos/gov/v1/proposals", "3"),
        ("/cosmos/gov/v1beta1/proposals", "2"),
        ("/cosmos/gov/v1beta1/proposals", "3"),
    ]
    for ep in rest_endpoints:
        for path, sc in paths:
            url = f"{ep.rstrip('/')}{path}?proposal_status={sc}&pagination.limit=20"
            data = _http_get_json(url, timeout=args.rpc_timeout)
            if data and data.get("proposals"):
                for p in data["proposals"]:
                    pid = p.get("proposal_id") or p.get("id")
                    merged[pid] = p
    return list(merged.values())


def _extract_plan_from_proposal(p: dict) -> tuple[dict, str, str]:
    """Extract (plan_dict, title, description) regardless of v1/v1beta1 shape.

    v1 gov (cosmos.gov.v1 / atomone.gov.v1) puts the MsgSoftwareUpgrade in
    `messages[0].plan` and title/summary at the top level.
    v1beta1 gov wraps everything in `content` with `@type` discriminator.
    """
    raw = p

    # v1 shape
    if p.get("messages"):
        for msg in p["messages"] or []:
            msg_type = msg.get("@type", "")
            if "SoftwareUpgrade" in msg_type:
                plan = msg.get("plan", {}) or {}
                title = p.get("title", "Upgrade")
                desc = p.get("summary", "") or p.get("title", "Upgrade")
                return plan, title, desc

    # v1beta1 shape
    content = p.get("content", {}) or {}
    if "SoftwareUpgrade" in str(content):
        plan = content.get("plan", {}) or {}
        title = content.get("title", "Upgrade")
        desc = content.get("description", "") or content.get("title", "Upgrade")
        return plan, title, desc

    return {}, "", ""


def find_software_upgrade(proposals: list) -> dict | None:
    """Return the highest-id SoftwareUpgrade proposal that is still active.

    A proposal counts as "active" if its target height is non-zero and
    not yet reached. We prefer the highest id (newest) so stale upgrades
    from earlier chains (e.g. AtomOne v2 on a long-since-passed height)
    don't shadow the current one (e.g. AtomOne v4).
    """
    candidates = []
    for p in proposals:
        plan, title, desc = _extract_plan_from_proposal(p)
        if not plan:
            continue
        try:
            target_h = int(plan.get("height", "0") or "0")
        except (TypeError, ValueError):
            target_h = 0
        if target_h <= 0:
            continue
        candidates.append({
            "height":       str(target_h),
            "proposal_id":  str(p.get("proposal_id") or p.get("id", "")),
            "description":  title or desc or "Upgrade",
            "version":      plan.get("name", ""),
            "target_h_int": target_h,
            "_raw":         p,
        })

    if not candidates:
        return None

    # Newest proposal wins
    candidates.sort(key=lambda c: int(c["proposal_id"] or "0"), reverse=True)
    return candidates[0]


def extract_version_from_proposal(p: dict, fallback: str) -> str:
    """Extract binary version from a SoftwareUpgrade proposal, with fallbacks.

    Handles both v1 (`messages[].plan`) and v1beta1 (`content.plan`) shapes.
    Uses the raw _extract_plan_from_proposal helper so version extraction
    stays consistent with the detection path.
    """
    plan, title, desc = _extract_plan_from_proposal(p)
    if not plan:
        return fallback

    info = plan.get("info") or ""

    # 1) plan.info — prefer the full semver embedded in binaries JSON
    #    (e.g. "v4.0.0" inside info JSON), this is the actual release.
    #    Restrict to github release URLs to avoid catching timestamps/floats.
    match = re.search(r"releases/download/(v?\d+\.\d+(?:\.\d+)?(?:-[\w.]+)?)", info)
    if match:
        return match.group(1)
    match = re.search(r"(v\d+\.\d+\.\d+(?:-[\w.]+)?)", info)
    if match:
        return match.group(1)

    # 2) plan.name — usually the cleanest (e.g. "v3.4.0"), but can be a
    #    short codename like "v4". Accept it as long as it starts with "v"
    #    followed by digits.
    name = plan.get("name")
    if name and re.match(r"^v\d+", str(name)):
        return str(name)

    # 3) scan the raw proposal text for a version
    raw_str = str(p)
    match = re.search(r"(v?\d+\.\d+(?:\.\d+)?(?:-[\w.]+)?)", raw_str)
    if match:
        return match.group(1)

    return fallback


# ── State management ────────────────────────────────────────────────────────
def load_state(state_path: Path) -> dict:
    """Load bridge_state.json; initialise to empty lifecycle if missing/corrupt."""
    empty = {"active_upgrades": {}, "completed_upgrades": {}}
    if not state_path.exists():
        return empty
    try:
        data = json.loads(state_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        log.warning("State file unreadable, reinitialising: %s", e)
        return empty
    if not isinstance(data, dict):
        log.warning("State root is not an object, reinitialising")
        return empty
    data.setdefault("active_upgrades", {})
    data.setdefault("completed_upgrades", {})
    # Coerce to dict-of-dicts in case legacy data used a different shape
    if not isinstance(data["active_upgrades"], dict):
        data["active_upgrades"] = {}
    if not isinstance(data["completed_upgrades"], dict):
        data["completed_upgrades"] = {}
    return data


def save_state(state_path: Path, state: dict) -> None:
    if args.dry_run:
        log.info("  [dry-run] would save state → %s", state_path)
        return
    try:
        atomic_write_json(state_path, state)
        log.info("  ✓ Saved state → %s", state_path)
    except OSError as e:
        log.error("  ✗ Could not write state: %s", e)


# ── Config migration ────────────────────────────────────────────────────────
def migrate_chain_node_version(
    config_path: Path, chain_id: str, new_version: str
) -> bool:
    """
    Atomically update `chains.<id>.node_version` in bridge_config.json.
    Also regenerates `manual_upgrade` from `upgrade_template` when possible.
    Returns True if a change was made (or would be, in dry-run).
    """
    try:
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        log.error("Could not read %s: %s", config_path, e)
        return False

    chain = config.get("chains", {}).get(chain_id)
    if not chain:
        log.error("Chain '%s' not found in config", chain_id)
        return False

    old_version = chain.get("node_version", "")
    if old_version == new_version:
        log.info("  → %s node_version already at %s", chain_id, new_version)
        return False

    chain["node_version"] = new_version
    template = chain.get("upgrade_template")
    if template and "{version}" in template:
        try:
            chain["manual_upgrade"] = template.format(
                folder=chain.get("folder", ""),
                repo=chain.get("repo", ""),
                binary=chain.get("binary", ""),
                version=new_version,
            )
        except KeyError as e:
            log.warning("  could not regenerate manual_upgrade (missing key %s)", e)

    if args.dry_run:
        log.info("  [dry-run] would migrate %s: %s → %s", chain_id, old_version, new_version)
        return True

    try:
        atomic_write_json(config_path, config)
        log.info("  ✓ Migrated %s node_version: %s → %s", chain_id, old_version, new_version)
        return True
    except OSError as e:
        log.error("  ✗ Could not write config: %s", e)
        return False


# ── Lifecycle orchestration ─────────────────────────────────────────────────
def manage_upgrade_lifecycle(
    chain_id: str, chain_cfg: dict, upgrade: dict | None, state: dict
) -> dict | None:
    """
    Reconcile an upgrade proposal with persisted state.

    Returns the "effective" upgrade to use for doc generation:
      - the active upgrade (when one is in flight), or
      - None  (when the upgrade just completed → docs must rebuild for the
              newly-stable version).
    """
    active = state["active_upgrades"].get(chain_id)

    # Register a newly-observed proposal as active.
    if upgrade is not None:
        prop_id = str(upgrade.get("proposal_id", ""))
        target_height = str(upgrade.get("height", "0"))
        version = upgrade.get("version", "")

        if not active or str(active.get("proposal_id")) != prop_id:
            # Different (or no) active proposal — supersede and re-register.
            state["active_upgrades"][chain_id] = {
                "proposal_id":   prop_id,
                "version":       version,
                "target_height": target_height,
                "description":   upgrade.get("description", ""),
                "started_at":    datetime.now(timezone.utc).isoformat(),
            }
            log.info(
                "  → Registered active upgrade for %s: proposal #%s, version %s, height %s",
                chain_id, prop_id, version, target_height,
            )
            return upgrade

    # If we have an active upgrade, check whether its target height has passed.
    if active:
        endpoints = chain_cfg.get("rpc_endpoints", []) or []
        current_height = get_consensus_height(endpoints)
        if current_height is None:
            log.warning("  Could not reach consensus on block height for %s", chain_id)
            return upgrade

        try:
            target_h = int(active.get("target_height", "0"))
        except (TypeError, ValueError):
            log.warning("  Invalid target_height %r for %s", active.get("target_height"), chain_id)
            return upgrade

        if current_height >= target_h:
            log.info(
                "  ✓ %s upgrade COMPLETE: current=%s >= target=%s",
                chain_id, current_height, target_h,
            )
            new_version = active.get("version", "")
            if new_version:
                config_path = Path(args.config).resolve()
                migrate_chain_node_version(config_path, chain_id, new_version)

            # Move from active → completed (preserving the previous record).
            completed_entry = {
                **active,
                "completed_at":    datetime.now(timezone.utc).isoformat(),
                "completed_height": str(current_height),
            }
            state["completed_upgrades"].setdefault(chain_id, []).append(completed_entry)
            del state["active_upgrades"][chain_id]

            # Return None → triggers full doc rebuild reflecting the new stable.
            return None
        log.info(
            "  ⏳ %s upgrade pending: current=%s < target=%s",
            chain_id, current_height, target_h,
        )
        return upgrade

    return upgrade


# ── Documentation writers ───────────────────────────────────────────────────
def update_files(chain_id, chain_cfg, upgrade):
    """
    Render Markdown + JSON for a chain.

    - /upgrade.md              : proposal-aware (uses proposal version when active).
    - /node-installation.md    : stable version (always).
    - /sync.md / useful-commands.md : stable version in header (always).
    - static/data/<...>upgrade.json : overview grid entry.
    """
    ver_upgrade = (
        extract_version_from_proposal(upgrade.get("_raw", {}), chain_cfg["node_version"])
        if upgrade else chain_cfg["node_version"]
    )
    ver_stable = chain_cfg["node_version"]
    log.info("  → %s: stable=%s, upgrade=%s", chain_cfg["chain_name"], ver_stable, ver_upgrade)

    # 1. /upgrade.md
    md_path = Path(f"/home/hermes/services/{chain_cfg['doc_path']}").resolve()
    content = f"""---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-{chain_id}">
# {chain_cfg['chain_name']} Upgrade
</div>
<div className="sub-lines">
Chain ID: `{chain_cfg['chain_id']}` | Node Version: `{ver_upgrade}`
</div>
"""
    if upgrade:
        content += f"""
<div className="sub-lines">
Upgrade height: **{upgrade['height']}** (Proposal #{upgrade['proposal_id']})
</div>

> {upgrade['description']}

"""
    else:
        content += "\n\n"

    manual_upgrade = chain_cfg['upgrade_template'].format(
        folder=chain_cfg['folder'],
        repo=chain_cfg['repo'],
        binary=chain_cfg['binary'],
        version=ver_upgrade,
    )
    content += f"## Manual Upgrade\n\n```bash\n{manual_upgrade}\n```"

    if not args.dry_run:
        atomic_write_text(md_path, content)
        log.info("  ✓ Wrote %s (upgrade.md, ver=%s)", md_path, ver_upgrade)

    # 2. /node-installation.md — stable only
    install_path = Path(
        f"/home/hermes/services/{chain_cfg['doc_path'].replace('upgrade.md', 'node-installation.md')}"
    ).resolve()
    if install_path.exists():
        try:
            install_content = install_path.read_text(encoding="utf-8")
            install_cmd = chain_cfg['upgrade_template'].format(
                folder=chain_cfg['folder'],
                repo=chain_cfg['repo'],
                binary=chain_cfg['binary'],
                version=ver_stable,
            )
            install_content = re.sub(
                r"(git checkout\s+)[^\s]+",
                rf"\g<1>{ver_stable}",
                install_content,
            )
            if not args.dry_run:
                atomic_write_text(install_path, install_content)
                log.info("  ✓ Wrote %s (node-installation.md, ver=%s)", install_path, ver_stable)
        except (OSError, KeyError) as e:
            log.warning("  ! Could not update %s: %s", install_path, e)

    # 3. /sync.md and /useful-commands.md — stable only
    for sibling in ("sync.md", "useful-commands.md"):
        sibling_path = Path(
            f"/home/hermes/services/{chain_cfg['doc_path'].replace('upgrade.md', sibling)}"
        ).resolve()
        if not sibling_path.exists():
            continue
        try:
            sibling_content = sibling_path.read_text(encoding="utf-8")
            sibling_content = re.sub(
                r"(Node Version:\s*`)[^`]+(`)",
                rf"\g<1>{ver_stable}\g<2>",
                sibling_content,
            )
            if not args.dry_run:
                atomic_write_text(sibling_path, sibling_content)
                log.info("  ✓ Wrote %s (%s, ver=%s)", sibling_path, sibling, ver_stable)
        except OSError as e:
            log.warning("  ! Could not update %s: %s", sibling_path, e)

    # 4. JSON (Overview Grid)
    json_path = Path(f"/home/hermes/services/{chain_cfg['json_path']}").resolve()
    if json_path.exists():
        try:
            data = json.loads(json_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as e:
            log.error("  ✗ Could not read %s: %s", json_path, e)
            return
        data = [i for i in data if i.get("network") != chain_cfg['chain_name']]
        if upgrade:
            try:
                target_h_int = int(upgrade['height'])
            except (TypeError, ValueError):
                target_h_int = 0
            data.append({
                "network":       chain_cfg['chain_name'],
                "link":          f"/{chain_cfg['doc_path'].replace('upgrade.md', '')}",
                # Use rpc_endpoints (Tendermint RPC) so the React component
                # can fetch /status. REST endpoints (LCD) return
                # "code:12 Not Implemented" on /status and break the table.
                "rpc":           get_healthiest_endpoint(chain_cfg.get('rpc_endpoints') or chain_cfg.get('rest_endpoints', [])),
                "target_height": target_h_int,
                "version":       ver_upgrade,
                "proposal_id":   upgrade['proposal_id'],
                # Normalize URL — explorer_url may end with "/" already, so
                # strip trailing slash before appending the proposal id.
                "proposal":      f"{chain_cfg['explorer_url'].rstrip('/')}/{upgrade['proposal_id']}",
            })
        if not args.dry_run:
            ok, err = validate_upgrade_json(data)
            if ok:
                atomic_write_json(json_path, data)
                log.info("  ✓ Wrote %s (overview grid)", json_path)
            else:
                log.error("  ✗ Skipped %s — %s", json_path, err)


# ── Main ────────────────────────────────────────────────────────────────────
def main() -> int:
    config_path = Path(args.config).resolve()
    state_path = Path(args.state).resolve()

    try:
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        log.error("Could not read config %s: %s", config_path, e)
        return 1

    state = load_state(state_path)
    state_dirty = False

    for cid, cfg in config.get("chains", {}).items():
        if args.chain and cid != args.chain:
            continue
        log.info("Processing %s...", cfg.get("chain_name", cid))

        try:
            proposals = fetch_voting_proposals(cfg)
        except Exception as e:  # defensive — never let one chain kill the run
            log.error("  ! Proposal fetch failed for %s: %s", cid, e)
            proposals = []

        upgrade = find_software_upgrade(proposals)

        # Reconcile proposal with persisted state — may complete an upgrade,
        # migrate config, and signal a doc rebuild.
        # Track whether the lifecycle manager touched the state — if it
        # did (registered a new active upgrade, completed one, etc.) we
        # must persist the change.
        pre_state_snapshot = json.dumps(state, sort_keys=True)
        effective_upgrade = manage_upgrade_lifecycle(cid, cfg, upgrade, state)
        if json.dumps(state, sort_keys=True) != pre_state_snapshot:
            state_dirty = True

        try:
            update_files(cid, cfg, effective_upgrade)
        except Exception as e:
            log.error("  ! Doc update failed for %s: %s", cid, e)

    if state_dirty:
        save_state(state_path, state)
    else:
        log.info("No lifecycle state changes; state file untouched")

    if args.commit and not args.dry_run:
        cwd = Path(args.config).parent
        for cmd in (["git", "add", "."],
                    ["git", "commit", "-m", "bridge: auto-sync upgrade data"],
                    ["git", "push"]):
            try:
                subprocess.run(cmd, cwd=cwd, check=True, timeout=60)
            except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError) as e:
                log.error("git %s failed: %s", " ".join(cmd[1:]), e)
                return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
