#!/bin/bash
# Shazoes Services - Dependency Installer
# Automatically detects current user for logging and environment setup

set -e
USER_NAME=$(whoami)
USER_GROUP=$(id -gn)

echo "=== [1/4] Installing system packages ==="
sudo apt update -y
sudo apt install -y python3 python3-pip python3-venv nginx nodejs yarn git curl jq logrotate

echo "=== [2/4] Setting up Python environment ==="
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install requests jsonschema websocket-client

echo "=== [3/4] Configuring logrotate ==="
cat <<EOF | sudo tee /etc/logrotate.d/shazoes-services
/home/$USER_NAME/services/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 $USER_NAME $USER_GROUP
    dateext
    dateformat -%Y%m%d
    sharedscripts
    postrotate
        systemctl reload shazoes-bot 2>/dev/null || true
    endscript
}
EOF

echo "=== [4/4] Finalizing directories ==="
mkdir -p data logs
chmod 700 data logs
[ -f data/bridge_state.json ] || echo "{}" > data/bridge_state.json

echo "✓ All set! Run: source venv/bin/activate && python3 scripts/governance_bridge.py --dry-run"
