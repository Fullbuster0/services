import json
import os
import sys
from unittest.mock import patch, MagicMock
from pathlib import Path

sys.path.append("/home/hermes/services/scripts")
import governance_bridge

def mock_fetch_voting_proposals_empty(chain_cfg):
    return []

# Patch governance_bridge.fetch_voting_proposals
with patch("governance_bridge.fetch_voting_proposals", side_effect=mock_fetch_voting_proposals_empty):
    governance_bridge.args = MagicMock()
    governance_bridge.args.config = "/home/hermes/services/bridge_config.json"
    governance_bridge.args.state = "/home/hermes/services/bridge_state.json"
    governance_bridge.args.dry_run = False
    governance_bridge.args.commit = False
    governance_bridge.args.chain = "atomone"
    
    governance_bridge.main()
