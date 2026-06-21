#!/usr/bin/env python3
"""
Governance Bridge — Independent Cosmos governance → Markdown/JSON updater
"""
import json
import os
import sys
import time
import re
import urllib.request
import urllib.error
import ssl
import logging
import argparse
import subprocess
from pathlib import Path
from datetime import datetime, timezone, timedelta
from jsonschema import validate, ValidationError, SchemaError

# ── CLI args ────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Cosmos Governance → Markdown Bridge")
parser.add_argument("--config", type=str, default="bridge_config.json")
parser.add_argument("--state", type=str, default="bridge_state.json")
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("--commit", action="store_true")
parser.add_argument("--chain", type=str, default=None)
args = parser.parse_args()

WIB = timezone(timedelta(hours=7))
LOG_PATH = Path("bridge.log").resolve()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", 
                    handlers=[logging.FileHandler(LOG_PATH, encoding="utf-8"), logging.StreamHandler()])
log = logging.getLogger("bridge")

def atomic_write_text(file_path: Path, content: str) -> None:
    tmp = str(file_path) + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f: f.write(content)
    os.replace(tmp, str(file_path))

def atomic_write_json(file_path: Path, data: dict | list) -> None:
    atomic_write_text(file_path, json.dumps(data, indent=2, ensure_ascii=False))

# ── JSON Schema validation ────────────────────────────────────────────────────
UPGRADE_ITEM_SCHEMA = {
    "type": "object",
    "properties": {
        "network":       {"type": "string", "minLength": 1},
        "link":          {"type": "string", "minLength": 1},
        "rpc":           {"type": "string", "minLength": 1},
        "target_height": {"type": "integer", "minimum": 0},
        "version":       {"type": "string", "minLength": 1},
        "proposal":      {"type": "string", "minLength": 1},
    },
    "required": ["network", "link", "rpc", "target_height", "version", "proposal"],
    "additionalProperties": False,
}
UPGRADE_JSON_SCHEMA = {"type": "array", "items": UPGRADE_ITEM_SCHEMA}

def validate_upgrade_json(data: list) -> tuple[bool, str]:
    if not isinstance(data, list): return False, "Root must be array"
    try:
        validate(instance=data, schema=UPGRADE_JSON_SCHEMA)
        return True, ""
    except ValidationError as e: return False, e.message

def check_endpoint_health(url: str, timeout: int = 5) -> bool:
    try:
        ctx = ssl._create_unverified_context()
        req = urllib.request.Request(f"{url.rstrip('/')}/status", headers={"User-Agent": "ServicesBridge/1.0"})
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            return r.status == 200 and "sync_info" in json.loads(r.read().decode("utf-8")).get("result", {})
    except: return False

def get_healthiest_endpoint(endpoints: list) -> str:
    for ep in endpoints:
        if check_endpoint_health(ep): return ep
    return endpoints[0] if endpoints else ""

def fetch_voting_proposals(chain_cfg: dict) -> list:
    eps = chain_cfg.get("rest_endpoints", [])
    paths = [("/atomone/gov/v1/proposals", "2"), ("/cosmos/gov/v1/proposals", "1"), ("/cosmos/gov/v1beta1/proposals", "2")]
    for ep in eps:
        for path, sc in paths:
            try:
                with urllib.request.urlopen(f"{ep.rstrip('/')}{path}?proposal_status={sc}&pagination.limit=10", timeout=5) as r:
                    data = json.loads(r.read().decode("utf-8"))
                    if data and data.get("proposals"): return data["proposals"]
            except: continue
    return []

def extract_version_from_proposal(p: dict, fallback: str) -> str:
    """Extract binary version from a SoftwareUpgrade proposal, with layered fallbacks."""
    plan = p.get("content", {}).get("plan", {}) or {}
    info = plan.get("info") or ""

    # 1) plan.name — usually the cleanest (e.g. "v3.4.0")
    name = plan.get("name")
    if name and re.match(r"^v?\d", str(name)):
        return str(name)

    # 2) scan plan.info for version-like patterns
    match = re.search(r"(v?\d+\.\d+(?:\.\d+)?(?:-[\w.]+)?)", info)
    if match:
        return match.group(1)

    # 3) scan title / description for a version
    for key in ("title", "description"):
        val = p.get("content", {}).get(key, "") or ""
        match = re.search(r"(v?\d+\.\d+(?:\.\d+)?(?:-[\w.]+)?)", str(val))
        if match:
            return match.group(1)

    # 4) nothing matched — keep chain's current node_version
    return fallback


def update_files(chain_id, chain_cfg, upgrade):
    # Determine the most accurate version available.
    if upgrade:
        ver = extract_version_from_proposal(upgrade.get("_raw", {}), chain_cfg["node_version"])
    else:
        ver = chain_cfg["node_version"]

    log.info(f"  → version in use for {chain_cfg['chain_name']}: {ver}")

    # 1. Update Markdown (Detail Page)
    md_path = Path(f"/home/hermes/services/{chain_cfg['doc_path']}").resolve()
    content = f"""---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-{chain_id}">
# {chain_cfg['chain_name']} Upgrade
</div>
<span className="sub-lines">Chain ID: `{chain_cfg['chain_id']}` | Node Version: `{ver}`</span>
"""
    if upgrade:
        content += f"""

<span>Upgrade height: **{upgrade['height']}** (Proposal #{upgrade['proposal_id']})</span>

> {upgrade['description']}
"""
    else:
        content += "\n\n"
    
    # Generate manual upgrade command
    manual_upgrade = chain_cfg['upgrade_template'].format(
        folder=chain_cfg['folder'],
        repo=chain_cfg['repo'],
        binary=chain_cfg['binary'],
        version=ver
    )
    content += f"\n\n## Manual Upgrade\n\n```bash\n{manual_upgrade}\n```"
    if not args.dry_run: atomic_write_text(md_path, content)
    
    # 2. Update JSON (Overview Grid)
    json_path = Path(f"/home/hermes/services/{chain_cfg['json_path']}").resolve()
    if json_path.exists():
        data = json.loads(json_path.read_text(encoding="utf-8"))
        data = [i for i in data if i.get("network") != chain_cfg['chain_name']]
        if upgrade:
            data.append({
                "network": chain_cfg['chain_name'],
                "link": f"/{chain_cfg['doc_path'].replace('upgrade.md', '')}",
                "rpc": get_healthiest_endpoint(chain_cfg['rest_endpoints']),
                "target_height": int(upgrade['height']),
                "version": ver,
                "proposal": f"{chain_cfg['explorer_url']}/{upgrade['proposal_id']}"
            })
        if not args.dry_run:
            ok, err = validate_upgrade_json(data)
            if ok:
                atomic_write_json(json_path, data)
                log.info(f"Wrote {json_path}")
            else:
                log.error(f"Skipped {json_path} — {err}")

def main():
    config = json.loads(Path(args.config).read_text())
    for cid, cfg in config["chains"].items():
        if args.chain and cid != args.chain: continue
        log.info(f"Processing {cfg['chain_name']}...")
        props = fetch_voting_proposals(cfg)
        upgrade = None
        for p in props:
            if "SoftwareUpgrade" in str(p.get("content", {})):
                h = p.get("content", {}).get("plan", {}).get("height", "0")
                upgrade = {
                    "height": h,
                    "proposal_id": p.get("proposal_id"),
                    "description": p.get("content", {}).get("title", "Upgrade"),
                    "version": p.get("content", {}).get("plan", {}).get("name", ""),
                    "_raw": p
                }
                break
        update_files(cid, cfg, upgrade)
    
    if args.commit and not args.dry_run:
        subprocess.run(["git", "add", "."], cwd=Path(args.config).parent)
        subprocess.run(["git", "commit", "-m", "bridge: auto-sync upgrade data"], cwd=Path(args.config).parent)
        subprocess.run(["git", "push"], cwd=Path(args.config).parent)

if __name__ == "__main__":
    main()
