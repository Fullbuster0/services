#!/usr/bin/env python3
"""Update bridge_config.json with folder, repo, binary, upgrade_template fields."""
import json

CONFIG_PATH = "/home/hermes/services/bridge_config.json"

CHAIN_META = {
    "atomone": {
        "folder": "atomone",
        "repo": "https://github.com/atomone-hub/atomone.git",
        "binary": "atomoned",
    },
    "terra": {
        "folder": "terra",
        "repo": "https://github.com/phoenix-directive/core",
        "binary": "terrad",
    },
    "axone": {
        "folder": "axoned",
        "repo": "https://github.com/axone-protocol/axoned.git",
        "binary": "axoned",
    },
    "hippo": {
        "folder": "hippo",
        "repo": "https://github.com/hippo-protocol/hippo.git",
        "binary": "hippod",
    },
    "lava": {
        "folder": "lava",
        "repo": "https://github.com/lavanet/lava.git",
        "binary": "lavad",
    },
    "shentu": {
        "folder": "shentu",
        "repo": "https://github.com/shentufoundation/shentu",
        "binary": "shentud",
    },
    "zetachain": {
        "folder": "zetacored",
        "repo": "https://github.com/zeta-chain/node.git",
        "binary": "zetacored",
    },
    "atomone-testnet": {
        "folder": "atomone",
        "repo": "https://github.com/atomone-hub/atomone.git",
        "binary": "atomoned",
    },
    "hippo-testnet": {
        "folder": "hippo",
        "repo": "https://github.com/hippo-protocol/hippo.git",
        "binary": "hippod",
    },
}

# Universal upgrade template (always passes folder to git clone for simplicity)
UPGRADE_TEMPLATE = (
    "cd $HOME\n"
    "rm -rf {folder}\n"
    "git clone {repo} {folder}\n"
    "cd {folder}\n"
    "git checkout {version}\n"
    "make install\n"
    "sudo systemctl restart {binary} && sudo journalctl -fu {binary} -o cat"
)

with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

for cid, cfg in config["chains"].items():
    meta = CHAIN_META.get(cid)
    if not meta:
        print(f"WARNING: No metadata for chain {cid}, skipping")
        continue
    cfg["folder"] = meta["folder"]
    cfg["repo"] = meta["repo"]
    cfg["binary"] = meta["binary"]
    cfg["upgrade_template"] = UPGRADE_TEMPLATE
    print(f"Updated {cid}: folder={meta['folder']}, repo={meta['repo']}, binary={meta['binary']}")

with open(CONFIG_PATH, "w") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)
    f.write("\n")

print("\nDone. bridge_config.json updated successfully.")
