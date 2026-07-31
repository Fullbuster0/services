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

<div className="h1-with-icon icon-seda">
# Seda Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `seda-1` | Node Version: `v1.0.7
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SEDA_CHAIN_ID="seda-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
sedad keys add wallet
```

### Recovery Wallet

```bash
sedad keys add wallet --recover
```

### List All Wallet

```bash
sedad keys list
```

### Delete Wallet

```bash
sedad keys delete wallet
```

### Check Wallet Balance

```bash
sedad q bank balances $(sedad keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
sedad tx staking create-validator \
--amount=1000000aseda \
--pubkey=$(sedad tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$SEDA_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=10000000000aseda
```

### Edit Validator

```bash
sedad tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$SEDA_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=10000000000aseda
```

### Check Jailed Reason

```bash
sedad query slashing signing-info $(sedad tendermint show-validator)
```

### Unjail Validator

```bash
sedad tx slashing unjail --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
sedad tx distribution withdraw-all-rewards --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

### Withdraw Rewards with Comission

```bash
sedad tx distribution withdraw-rewards $(sedad keys show wallet --bech val -a) --commission --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

### Delegate Tokens to Your Validator

```bash
sedad tx staking delegate $(sedad keys show wallet --bech val -a) 100000aseda --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

### Redelegate Tokens to Another Validator

```bash
sedad tx staking redelegate $(sedad keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000aseda --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

### Unbond Tokens from Your Validator

```bash
sedad tx staking unbond $(sedad keys show wallet --bech val -a) 100000aseda --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

### Send Tokens to Any Wallet

```bash
sedad tx bank send wallet <TO_WALLET_ADDRESS> 100000aseda --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
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
sudo systemctl enable sedad
```

### Disable Service

```bash
sudo systemctl disable sedad
```

### Start Service

```bash
sudo systemctl start sedad
```

### Stop Service

```bash
sudo systemctl stop sedad
```

### Restart Service

```bash
sudo systemctl restart sedad
```

### Check Service Status

```bash
sudo systemctl status sedad
```

### Check Service Logs

```bash
sudo journalctl -u sedad -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
sedad tx gov vote 1 yes --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

### List all Proposals

```bash
sedad query gov proposals
```

### Check Vote

```bash
sedad tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $SEDA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10000000000aseda -y
```

### Create new Proposal

```bash
sedad tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000aseda \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=10000000000aseda \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.sedad/config/config.toml
```

### Get Validator Info

```bash
sedad status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
sedad q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
sedad status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
sedad status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(sedad tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.sedad/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"10000000000aseda\"/" $HOME/.sedad/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.sedad/config/config.toml
```

### Reset Chain Data

```bash
sedad tendermint unsafe-reset-all --home $HOME/.sedad --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop sedad && sudo systemctl disable sedad && sudo rm /etc/systemd/system/sedad.service && sudo systemctl daemon-reload && sudo rm -rf $(which sedad) && rm -rf $HOME/.sedad
```

</TabItem>

</Tabs>
