---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="archived-notice-banner">
  <span className="badge-archive">ARCHIVE</span>
  <span className="notice-text">Network no longer actively validated · Services docs only</span>
</div>

<div className="h1-with-icon icon-story">
# Story  Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `aeneid` | Node Version: `v1.3.0`
</span>
<Tabs>
<TabItem value="validator" label="Validator">

## Validator

### Validator Info

```bash
curl localhost:$(sed -n '/\[rpc\]/,/laddr/ { /laddr/ {s/.*://; s/".*//; p} }' $HOME/.story/story/config/config.toml)/status | jq
```

### View your validator key

```bash
story validator export
```

### Export EVM private key

```bash
story validator export --export-evm-key
```

### View EVM private key and make a key backup

```bash
cat $HOME/.story/story/config/private_key.txt
```

### Create Validator, Locked

```bash
story validator create --stake 1024000000000000000000 --moniker $MONIKER --chain-id 1315 --unlocked=false
```

### Create Validator, Unlocked

```bash
story validator create --stake 1024000000000000000000 --moniker $MONIKER --chain-id 1315 --unlocked=true
```

### Unjail Validator

```bash
story validator unjail --rpc https://aeneid.storyrpc.io --chain-id 1315
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
story tx distribution withdraw-all-rewards --from wallet --chain-id $STORY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Withdraw Rewards with Comission

```bash
story tx distribution withdraw-rewards $(story keys show wallet --bech val -a) --commission --from wallet --chain-id $STORY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Delegate Tokens to Your Validator

```bash
story validator stake --chain-id 1315 --validator-pubkey $(story validator export | grep "Compressed Public Key (hex)" | awk '{print $NF}') --stake 1000000000000000000 --private-key $(cat $HOME/.story/story/config/private_key.txt | grep "PRIVATE_KEY" | awk -F'=' '{print $2}')
```

### Delegate on Behalf of Other Delegator

```bash
story validator stake-on-behalf --chain-id 1315 --validator-pubkey <VALIDATOR_PUB_KEY_IN_HEX> --delegator-pubkey <DELEGATOR_PUB_KEY_IN_HEX> --stake 1000000000000000000 --private-key $(cat $HOME/.story/story/config/private_key.txt | grep "PRIVATE_KEY" | awk -F'=' '{print $2}')
```

### Add Operator

```bash
story validator add-operator --chain-id 1315 --operator <OPERATOR_EVM_ADDRESS> --private-key $(cat $HOME/.story/story/config/private_key.txt | grep "PRIVATE_KEY" | awk -F'=' '{print $2}')
```

### Unbond Tokens from Your Validator

```bash
story validator unstake --chain-id 1315 --validator-pubkey $(story validator export | grep "Compressed Public Key (hex)" | awk '{print $NF}') --unstake 1000000000000000000 --private-key $(cat $HOME/.story/story/config/private_key.txt | grep "PRIVATE_KEY" | awk -F'=' '{print $2}')
```

### Unstake on Behalf of Other Delegator. To do so, You must be a registered authorized operator for this delegator.

```bash
story validator unstake-on-behalf --chain-id 1315 --validator-pubkey <VALIDATOR_PUB_KEY_IN_HEX> --delegator-pubkey <DELEGATOR_PUB_KEY_IN_HEX> --unstake 1000000000000000000 --private-key $(cat $HOME/.story/story/config/private_key.txt | grep "PRIVATE_KEY" | awk -F'=' '{print $2}')
```

### Remove Operator

```bash
story validator remove-operator --operator <OPERATOR_EVM_ADDRESS> --private-key $(cat $HOME/.story/story/config/private_key.txt | grep "PRIVATE_KEY" | awk -F'=' '{print $2}')
```

### Set or Change Withdrawal Address

```bash
story validator set-withdrawal-address --withdrawal-address <YOUR_EVM_ADDRESS> --private-key $(cat $HOME/.story/story/config/private_key.txt | grep "PRIVATE_KEY" | awk -F'=' '{print $2}')
```

</TabItem>
<TabItem value="service" label="Service">

## Service

### Reload Service

```bash
sudo systemctl daemon-reload
```

### Enable Service

```bash
sudo systemctl enable story
```

### Disable Service

```bash
sudo systemctl disable story
```

### Start Service

```bash
sudo systemctl start story
```

### Stop Service

```bash
sudo systemctl stop story
```

### Restart Service

```bash
sudo systemctl restart story
```

### Check Service Status

```bash
sudo systemctl status story
```

### Check Service Logs

```bash
sudo journalctl -u story -f --no-hostname -o cat
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Get Latest Height

```bash
story status 2>&1 | jq .sync_info
```

### Get Node Peer

```bash
echo "$(curl localhost:$(sed -n '/\[rpc\]/,/laddr/ { /laddr/ {s/.*://; s/".*//; p} }' $HOME/.story/story/config/config.toml)/status | jq -r '.result.node_info.id')@$(wget -qO- eth0.me):$(sed -n '/Address to listen for incoming connection/{n;p;}' $HOME/.story/story/config/config.toml | sed 's/.*://; s/".*//')"
```

### Your enode

```bash
geth --exec "admin.nodeInfo.enode" attach ~/.story/geth/aeneid/geth.ipc
```

### Enable Prometheus

```bash
sed -i -e "s/prometheus = false/prometheus = true/" $HOME/.story/story/config/config.toml
```

</TabItem>
<TabItem value="Geth" label="Geth">

## Geth Commands

### Get Latest Height

```bash
geth --exec "eth.blockNumber" attach ~/.story/geth/aeneid/geth.ipc
```

### Peers Your Client is Connected to

```bash
geth --exec "admin.peers" attach ~/.story/geth/aeneid/geth.ipc
```

### Check Sync

```bash
geth --exec "eth.syncing" attach ~/.story/geth/aeneid/geth.ipc
```

### Check Gas Price

```bash
geth --exec "eth.gasPrice" attach ~/.story/geth/aeneid/geth.ipc
```

### Check Account Balance

```bash
geth --exec "eth.getBalance('<YOUR_EVM_ADDRESS>')" attach ~/.story/geth/aeneid/geth.ipc
```

### Delete Node

```bash
sudo systemctl stop story && sudo systemctl disable story && sudo rm /etc/systemd/system/story.service && sudo systemctl daemon-reload && sudo rm -rf $(which story) && rm -rf $HOME/.story
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop story && sudo systemctl disable story && sudo rm /etc/systemd/system/story.service && sudo systemctl daemon-reload && sudo rm -rf $(which story) && rm -rf $HOME/.story
```

</TabItem>

</Tabs>
