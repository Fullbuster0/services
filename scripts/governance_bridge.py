#!/usr/bin/env python3
"""
Governance Bridge — Independent Cosmos governance → Markdown/JSON updater
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

def http_get_json(url: str, timeout: int = 15) -> dict | None:
    try:
        ctx = ssl._create_unverified_context()
        req = urllib.request.Request(url, headers={"User-Agent": "ServicesBridge/1.0"})
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            return json.loads(r.read().decode("utf-8")) if r.status == 200 else None
    except: return None

def fetch_voting_proposals(chain_cfg: dict) -> list:
    eps = chain_cfg.get("rest_endpoints", [])
    gov = chain_cfg.get("gov_module", "v1beta1")
    paths = [("/atomone/gov/v1/proposals", "2"), ("/cosmos/gov/v1/proposals", "1"), ("/cosmos/gov/v1beta1/proposals", "2")]
    for ep in eps:
        for path, sc in paths:
            data = http_get_json(f"{ep.rstrip('/')}{path}?proposal_status={sc}&pagination.limit=10")
            if data and data.get("proposals"): return data["proposals"]
    return []

def update_files(chain_id, chain_cfg, upgrade):
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
<span className="sub-lines">Chain ID: `{chain_cfg['chain_id']}` | Node Version: `{chain_cfg['node_version']}`</span>
"""
    if upgrade:
        content += f"\n\n<span>Upgrade height: **{upgrade['height']}** (Proposal #{upgrade['proposal_id']})</span>\n\n> {upgrade['description']}\n"
    else:
        content += "\n\n<span>No active upgrade proposal.</span>\n"
    content += f"\n\n## Manual Upgrade\n\n```js\n{chain_cfg['manual_upgrade']}\n```"
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
                "rpc": chain_cfg['rest_endpoints'][0],
                "target_height": int(upgrade['height']),
                "version": chain_cfg['node_version'],
                "proposal": f"{chain_cfg['explorer_url']}/{upgrade['proposal_id']}"
            })
        if not args.dry_run: atomic_write_json(json_path, data)

def main():
    config = json.loads(Path(args.config).read_text())
    for cid, cfg in config["chains"].items():
        if args.chain and cid != args.chain: continue
        log.info(f"Processing {cfg['chain_name']}...")
        props = fetch_voting_proposals(cfg)
        upgrade = None
        for p in props:
            if "SoftwareUpgrade" in str(p.get("content", {})):
                # Simplified extraction for demo
                h = p.get("content", {}).get("plan", {}).get("height", "0")
                upgrade = {"height": h, "proposal_id": p.get("proposal_id"), "description": p.get("content", {}).get("title", "Upgrade")}
                break
        update_files(cid, cfg, upgrade)
    
    if args.commit and not args.dry_run:
        subprocess.run(["git", "add", "."], cwd=Path(args.config).parent)
        subprocess.run(["git", "commit", "-m", "bridge: auto-sync upgrade data"], cwd=Path(args.config).parent)
        subprocess.run(["git", "push"], cwd=Path(args.config).parent)

if __name__ == "__main__":
    main()
