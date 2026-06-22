# Upgrade State Demo Files

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

Generated at: 2026-06-21T11:03:11Z
