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

<div className="h1-with-icon icon-babylon">
# Babylon Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `bbn-1` | Node Version: `v2.2.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export BABYLON_CHAIN_ID="bbn-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
babylond keys add wallet
```

### Recovery Wallet

```bash
babylond keys add wallet --recover
```

### List All Wallet

```bash
babylond keys list
```

### Delete Wallet

```bash
babylond keys delete wallet
```

### Check Wallet Balance

```bash
babylond q bank balances $(babylond keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
babylond tx staking create-validator \
--amount=1000000ubbn \
--pubkey=$(babylond tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$BABYLON_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.002ubbn
```

### Edit Validator

```bash
babylond tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$BABYLON_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.002ubbn
```

### Check Jailed Reason

```bash
babylond query slashing signing-info $(babylond tendermint show-validator)
```

### Unjail Validator

```bash
babylond tx slashing unjail --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
babylond tx distribution withdraw-all-rewards --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

### Withdraw Rewards with Comission

```bash
babylond tx distribution withdraw-rewards $(babylond keys show wallet --bech val -a) --commission --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

### Delegate Tokens to Your Validator

```bash
babylond tx staking delegate $(babylond keys show wallet --bech val -a) 100000ubbn --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

### Redelegate Tokens to Another Validator

```bash
babylond tx staking redelegate $(babylond keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000ubbn --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

### Unbond Tokens from Your Validator

```bash
babylond tx staking unbond $(babylond keys show wallet --bech val -a) 100000ubbn --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

### Send Tokens to Any Wallet

```bash
babylond tx bank send wallet <TO_WALLET_ADDRESS> 100000ubbn --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
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
sudo systemctl enable babylond
```

### Disable Service

```bash
sudo systemctl disable babylond
```

### Start Service

```bash
sudo systemctl start babylond
```

### Stop Service

```bash
sudo systemctl stop babylond
```

### Restart Service

```bash
sudo systemctl restart babylond
```

### Check Service Status

```bash
sudo systemctl status babylond
```

### Check Service Logs

```bash
sudo journalctl -u babylond -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
babylond tx gov vote 1 yes --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

### List all Proposals

```bash
babylond query gov proposals
```

### Check Vote

```bash
babylond tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $BABYLON_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.002ubbn -y
```

### Create new Proposal

```bash
babylond tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000ubbn \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.002ubbn \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.babylond/config/config.toml
```

### Get Validator Info

```bash
babylond status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
babylond q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
babylond status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
babylond status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(babylond tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.babylond/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.002ubbn\"/" $HOME/.babylond/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.babylond/config/config.toml
```

### Reset Chain Data

```bash
babylond tendermint unsafe-reset-all --home $HOME/.babylond --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop babylond && sudo systemctl disable babylond && sudo rm /etc/systemd/system/babylond.service && sudo systemctl daemon-reload && sudo rm -rf $(which babylond) && rm -rf $HOME/.babylond
```

</TabItem>

</Tabs>
