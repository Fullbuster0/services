#!/bin/bash
# Auto-run wrapper for governance bridge
# Called by cron job every hour

set -e

# Navigate to services repo
cd /home/hermes/services || exit 1

# Run the bridge (update markdown + JSON)
python3 scripts/governance_bridge.py --commit

# Update README timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
sed -i "/<!-- AUTO-UPDATE-TIMESTAMP -->/c<!-- AUTO-UPDATE-TIMESTAMP --> Last run: $TIMESTAMP" README.md

# Commit & push README update (idempotent)
if git diff --quiet README.md 2>/dev/null; then
    echo "No README change, skipping commit"
else
    git add README.md
    git commit -m "chore(bridge): auto-update timestamp"
    git push origin main
fi

echo "Governance bridge completed at $TIMESTAMP"
