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
  <span className="notice-text">Network no longer actively validated · Services docs only (no updated)</span>
</div>

<div className="h1-with-icon icon-structs">
# Structs Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `structstestnet-101` | Node Version: `v0.6.0-beta`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export STRUCTS_CHAIN_ID="structstestnet-101"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
structsd keys add wallet
```

### Recovery Wallet

```bash
structsd keys add wallet --recover
```

### List All Wallet

```bash
structsd keys list
```

### Delete Wallet

```bash
structsd keys delete wallet
```

### Check Wallet Balance

```bash
structsd q bank balances $(structsd keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
structsd tx staking create-validator \
--amount=1000000agnet \
--pubkey=$(structsd tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$STRUCTS_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0alpha
```

### Edit Validator

```bash
structsd tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$STRUCTS_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0alpha
```

### Check Jailed Reason

```bash
structsd query slashing signing-info $(structsd tendermint show-validator)
```

### Unjail Validator

```bash
structsd tx slashing unjail --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
structsd tx distribution withdraw-all-rewards --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

### Withdraw Rewards with Comission

```bash
structsd tx distribution withdraw-rewards $(structsd keys show wallet --bech val -a) --commission --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

### Delegate Tokens to Your Validator

```bash
structsd tx staking delegate $(structsd keys show wallet --bech val -a) 100000agnet --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

### Redelegate Tokens to Another Validator

```bash
structsd tx staking redelegate $(structsd keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000agnet --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

### Unbond Tokens from Your Validator

```bash
structsd tx staking unbond $(structsd keys show wallet --bech val -a) 100000agnet --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

### Send Tokens to Any Wallet

```bash
structsd tx bank send wallet <TO_WALLET_ADDRESS> 100000agnet --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
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
sudo systemctl enable structsd
```

### Disable Service

```bash
sudo systemctl disable structsd
```

### Start Service

```bash
sudo systemctl start structsd
```

### Stop Service

```bash
sudo systemctl stop structsd
```

### Restart Service

```bash
sudo systemctl restart structsd
```

### Check Service Status

```bash
sudo systemctl status structsd
```

### Check Service Logs

```bash
sudo journalctl -u structsd -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
structsd tx gov vote 1 yes --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

### List all Proposals

```bash
structsd query gov proposals
```

### Check Vote

```bash
structsd tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $STRUCTS_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0alpha -y
```

### Create new Proposal

```bash
structsd tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000agnet \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0alpha \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.structs/config/config.toml
```

### Get Validator Info

```bash
structsd status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
structsd q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
structsd status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
structsd status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(structsd tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.structs/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0alpha\"/" $HOME/.structs/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.structs/config/config.toml
```

### Reset Chain Data

```bash
structsd tendermint unsafe-reset-all --home $HOME/.structs --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop structsd && sudo systemctl disable structsd && sudo rm /etc/systemd/system/structsd.service && sudo systemctl daemon-reload && sudo rm -rf $(which structsd) && rm -rf $HOME/.structs
```

</TabItem>

</Tabs>
