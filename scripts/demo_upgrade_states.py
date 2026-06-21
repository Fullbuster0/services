#!/usr/bin/env python3
"""
demo_upgrade_states.py
======================
Generate three sample `mainnetupgrade.json` files that simulate the three
phases of a Cosmos chain upgrade governance lifecycle. The output is written
to ``services/static/data/demo/`` so that React components (or humans) can
inspect how the JSON structure changes as the upgrade progresses.

States simulated
----------------
1. PROPOSAL_DETECTED  – Proposal submitted, in voting period.
                         Target height is far in the future.
2. UPGRADE_ACTIVE     – Approaching / entering target height
                         (e.g. 1 block or 100 blocks away). Critical display.
3. UPGRADE_COMPLETED  – Upgrade has passed the target height.
                         The entry should be deleted or archived.

Usage
-----
    # Generate demo files with the default placeholder data
    python3 services/scripts/demo_upgrade_states.py

    # Override the current "live" height used to compute the targets
    python3 services/scripts/demo_upgrade_states.py --current-height 21500000

    # Also write a small README explaining each file
    python3 services/scripts/demo_upgrade_states.py --readme

Author : Services Bridge Team
License: MIT
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


# ---------------------------------------------------------------------------
# Path configuration
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
SERVICES_DIR = SCRIPT_DIR.parent           # .../services
DEMO_DIR = SERVICES_DIR / "static" / "data" / "demo"

# Output file names (one per state)
FILE_PROPOSAL_DETECTED = DEMO_DIR / "proposal_detected.json"
FILE_UPGRADE_ACTIVE = DEMO_DIR / "upgrade_active.json"
FILE_UPGRADE_COMPLETED = DEMO_DIR / "upgrade_completed.json"
FILE_README = DEMO_DIR / "README.md"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _utcnow_iso() -> str:
    """Return current UTC time in ISO-8601 format (Z-suffixed)."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _write_json(path: Path, payload: Any) -> None:
    """Write JSON to ``path`` atomically with a trailing newline."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    tmp_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    tmp_path.replace(path)


def banner(title: str) -> None:
    """Pretty console banner."""
    line = "─" * 70
    print(f"\n{line}\n  {title}\n{line}")


# ---------------------------------------------------------------------------
# Demo data
# ---------------------------------------------------------------------------
# A handful of realistic-looking chain entries. The fields mirror the schema
# used by ``services/scripts/governance_bridge.py``:
#   network, link, rpc, target_height, version, proposal
#
# All RPC endpoints below are real public endpoints so the React component
# (`ChainUpgradeTable.tsx`) can actually fetch the latest block height when
# the demo files are used.  Swap them for your own endpoints as needed.
DEMO_CHAINS = [
    {
        "network": "Cosmos Hub",
        "link": "/mainnets/cosmoshub/",
        "rpc": "https://cosmoshub-rpc.publicnode.com:443",
        "version": "v18.0.0",
        "explorer": "https://www.mintscan.io/cosmos/gov/",
    },
    {
        "network": "Osmosis",
        "link": "/mainnets/osmosis/",
        "rpc": "https://osmosis-rpc.publicnode.com:443",
        "version": "v25.0.0",
        "explorer": "https://www.mintscan.io/osmosis/gov/",
    },
    {
        "network": "Celestia",
        "link": "/mainnets/celestia/",
        "rpc": "https://celestia-rpc.publicnode.com:443",
        "version": "v2.0.0",
        "explorer": "https://www.mintscan.io/celestia/gov/",
    },
    {
        "network": "Injective",
        "link": "/mainnets/injective/",
        "rpc": "https://injective-rpc.publicnode.com:443",
        "version": "v1.16.0",
        "explorer": "https://www.mintscan.io/injective/gov/",
    },
]


def _build_entry(
    chain: dict[str, str],
    target_height: int,
    proposal_id: int,
    *,
    title: str,
    description: str,
    state_label: str,
) -> dict[str, Any]:
    """Build a single upgrade entry augmented with state metadata."""
    entry = {
        "network": chain["network"],
        "link": chain["link"],
        "rpc": chain["rpc"],
        "target_height": int(target_height),
        "version": chain["version"],
        "proposal": f"{chain['explorer']}{proposal_id}",
    }
    # Non-schema metadata used only by the demo for clarity.  The React
    # component tolerates unknown keys (it spreads them onto rows), so these
    # additional fields will simply appear as extra columns when the demo
    # data is rendered.
    entry["__demo_state"] = state_label
    entry["__demo_proposal_id"] = proposal_id
    entry["__demo_title"] = title
    entry["__demo_description"] = description
    return entry


# ---------------------------------------------------------------------------
# State builders
# ---------------------------------------------------------------------------
def build_proposal_detected(current_height: int) -> list[dict[str, Any]]:
    """
    State 1 — Proposal detected.

    The governance proposal has been submitted and entered the voting period.
    The target_height is far in the future (~7 days away at 6.5 s/block),
    so the React component should render it as a normal "upcoming" row with
    a comfortable countdown.
    """
    banner("1. PROPOSAL_DETECTED — far-future target")
    blocks_per_day = int(24 * 60 * 60 / 6.5)          # ≈ 13,292
    far_target = current_height + 7 * blocks_per_day   # ~7 days out

    chain = DEMO_CHAINS[0]                             # Cosmos Hub
    entries = [
        _build_entry(
            chain,
            target_height=far_target,
            proposal_id=842,
            title="v18.x Mainnet Upgrade",
            description=(
                "Scheduled protocol upgrade. Voting period is open; "
                "target height is approximately seven days from now."
            ),
            state_label="PROPOSAL_DETECTED",
        )
    ]
    print(f"  • network        : {entries[0]['network']}")
    print(f"  • target_height  : {entries[0]['target_height']:,}")
    print(f"  • proposal_id    : {entries[0]['__demo_proposal_id']}")
    print(f"  • blocks away    : {entries[0]['target_height'] - current_height:,}")
    print(f"  • eta (approx)   : ~7 days")
    return entries


def build_upgrade_active(current_height: int) -> list[dict[str, Any]]:
    """
    State 2 — Upgrade active / imminent.

    The proposal has already passed voting and the chain is approaching the
    target height.  We emit two example rows:

      * One ~100 blocks away (~10 minutes)  — Osmosis
      * One ~1 block away    (~6.5 seconds) — Celestia (critical!)
    """
    banner("2. UPGRADE_ACTIVE — approaching target")

    chains = DEMO_CHAINS[1:3]                          # Osmosis + Celestia
    offsets = [100, 1]                                 # blocks remaining

    entries: list[dict[str, Any]] = []
    for chain, blocks_left, proposal_id, label in zip(
        chains,
        offsets,
        [915, 73],
        ["IMMINENT (~100 blocks)", "CRITICAL (~1 block)"],
    ):
        target = current_height + blocks_left
        entry = _build_entry(
            chain,
            target_height=target,
            proposal_id=proposal_id,
            title=f"{chain['network']} hot-fix upgrade",
            description=(
                "Voting has concluded; the chain is approaching the "
                "scheduled upgrade height.  Operators must upgrade before "
                "this block is reached."
            ),
            state_label=f"UPGRADE_ACTIVE::{label}",
        )
        entries.append(entry)
        print(
            f"  • {entry['network']:<11} "
            f"target={entry['target_height']:,}  "
            f"blocks_left={blocks_left:<3}  "
            f"proposal_id={proposal_id}  [{label}]"
        )
    return entries


def build_upgrade_completed(current_height: int) -> list[dict[str, Any]]:
    """
    State 3 — Upgrade completed / passed.

    Once the upgrade height is reached, the entry should be removed from the
    main JSON (or archived separately).  For the demo we emit an empty array
    to demonstrate the "deleted" branch of the lifecycle, but we also show
    what an *archived* record would look like by placing it in a sibling
    file (``upgrade_completed_archived.json``).
    """
    banner("3. UPGRADE_COMPLETED — entry removed (empty array)")

    completed_at = _utcnow_iso()
    chain = DEMO_CHAINS[2]                             # Celestia
    past_target = current_height - 1                   # already passed
    archived_entry = _build_entry(
        chain,
        target_height=past_target,
        proposal_id=70,
        title="Celestia v1.x → v2.0 upgrade",
        description="Successfully executed at the scheduled height.",
        state_label="UPGRADE_COMPLETED",
    )
    archived_entry["__demo_completed_at"] = completed_at
    archived_entry["__demo_status"] = "PASSED"

    archived_path = DEMO_DIR / "upgrade_completed_archived.json"
    _write_json(archived_path, [archived_entry])
    print(f"  • main file       : empty array []")
    print(f"  • archive sample  : {archived_path.relative_to(SERVICES_DIR)}")
    print(f"  • archived entry  : {archived_entry['network']} "
          f"@ height {archived_entry['target_height']:,}")
    print(f"  • completed_at    : {completed_at}")
    return []  # Main "completed" JSON is intentionally empty.


# ---------------------------------------------------------------------------
# Optional README
# ---------------------------------------------------------------------------
README_TEMPLATE = """# Upgrade State Demo Files

These JSON snapshots illustrate how `static/data/mainnetupgrade.json` (and the
testnet counterpart) should look across the three phases of a Cosmos chain
upgrade governance lifecycle.

| File                                | State                | Description                                                                 |
| ----------------------------------- | -------------------- | --------------------------------------------------------------------------- |
| `proposal_detected.json`            | `PROPOSAL_DETECTED`  | Proposal submitted & in voting period.  Target height is ~7 days away.      |
| `upgrade_active.json`               | `UPGRADE_ACTIVE`     | Proposal passed; chain is approaching the upgrade height (1 & 100 blocks).  |
| `upgrade_completed.json`            | `UPGRADE_COMPLETED`  | Upgrade executed; entry has been removed from the active list (`[]`).       |
| `upgrade_completed_archived.json`   | `UPGRADE_COMPLETED`  | Optional archive of the entry that has just been retired.                   |

The `__demo_*` keys are not part of the production schema — they exist only
to make the demo data self-documenting.  The React component
(`src/components/Upgrade/ChainUpgradeTable.tsx`) tolerates extra fields and
will simply render them as additional columns.

## Using these files in the UI

To preview a particular state, temporarily replace
`static/data/mainnetupgrade.json` with one of the demo files, e.g.:

```bash
cp static/data/demo/upgrade_active.json static/data/mainnetupgrade.json
pnpm start   # http://localhost:3000
```

Restore the live file afterwards:

```bash
git checkout -- static/data/mainnetupgrade.json
```

Generated at: {generated_at}
"""


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------
def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Generate three sample `mainnetupgrade.json` files that "
            "simulate the PROPOSAL_DETECTED, UPGRADE_ACTIVE, and "
            "UPGRADE_COMPLETED phases of a Cosmos chain upgrade."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--current-height",
        type=int,
        default=21_500_000,
        help=(
            "Mock current block height used to compute the demo "
            "target_height values (default: %(default)s)."
        ),
    )
    parser.add_argument(
        "--readme",
        action="store_true",
        help="Also write a README.md describing the demo files.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    print(f"Demo output directory: {DEMO_DIR}")
    print(f"Current height (mock): {args.current_height:,}")

    detected = build_proposal_detected(args.current_height)
    active = build_upgrade_active(args.current_height)
    completed = build_upgrade_completed(args.current_height)

    _write_json(FILE_PROPOSAL_DETECTED, detected)
    _write_json(FILE_UPGRADE_ACTIVE, active)
    _write_json(FILE_UPGRADE_COMPLETED, completed)

    print("\nFiles written:")
    for f in (FILE_PROPOSAL_DETECTED, FILE_UPGRADE_ACTIVE, FILE_UPGRADE_COMPLETED):
        size = f.stat().st_size
        print(f"  ✓ {str(f.relative_to(SERVICES_DIR)):<55} ({size} bytes)")

    if args.readme:
        readme = README_TEMPLATE.format(generated_at=_utcnow_iso())
        FILE_README.write_text(readme, encoding="utf-8")
        print(f"  ✓ {str(FILE_README.relative_to(SERVICES_DIR)):<55} (README)")

    print("\nAll three upgrade-state demo files generated successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())