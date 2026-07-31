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

<div className="h1-with-icon icon-galactica">
# Galactica Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `galactica_9302-1` | Node Version: `v0.1.2`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export GALACTICA_CHAIN_ID="galactica_9302-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
galacticad keys add wallet
```

### Recovery Wallet

```bash
galacticad keys add wallet --recover
```

### List All Wallet

```bash
galacticad keys list
```

### Delete Wallet

```bash
galacticad keys delete wallet
```

### Check Wallet Balance

```bash
galacticad q bank balances $(galacticad keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
galacticad tx staking create-validator \
--amount=1000000agnet \
--pubkey=$(galacticad tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$GALACTICA_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1agnet
```

### Edit Validator

```bash
galacticad tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$GALACTICA_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1agnet
```

### Check Jailed Reason

```bash
galacticad query slashing signing-info $(galacticad tendermint show-validator)
```

### Unjail Validator

```bash
galacticad tx slashing unjail --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
galacticad tx distribution withdraw-all-rewards --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

### Withdraw Rewards with Comission

```bash
galacticad tx distribution withdraw-rewards $(galacticad keys show wallet --bech val -a) --commission --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

### Delegate Tokens to Your Validator

```bash
galacticad tx staking delegate $(galacticad keys show wallet --bech val -a) 100000agnet --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

### Redelegate Tokens to Another Validator

```bash
galacticad tx staking redelegate $(galacticad keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000agnet --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

### Unbond Tokens from Your Validator

```bash
galacticad tx staking unbond $(galacticad keys show wallet --bech val -a) 100000agnet --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

### Send Tokens to Any Wallet

```bash
galacticad tx bank send wallet <TO_WALLET_ADDRESS> 100000agnet --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
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
sudo systemctl enable galacticad
```

### Disable Service

```bash
sudo systemctl disable galacticad
```

### Start Service

```bash
sudo systemctl start galacticad
```

### Stop Service

```bash
sudo systemctl stop galacticad
```

### Restart Service

```bash
sudo systemctl restart galacticad
```

### Check Service Status

```bash
sudo systemctl status galacticad
```

### Check Service Logs

```bash
sudo journalctl -u galacticad -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
galacticad tx gov vote 1 yes --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

### List all Proposals

```bash
galacticad query gov proposals
```

### Check Vote

```bash
galacticad tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $GALACTICA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1agnet -y
```

### Create new Proposal

```bash
galacticad tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000agnet \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1agnet \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.galactica/config/config.toml
```

### Get Validator Info

```bash
galacticad status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
galacticad q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
galacticad status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
galacticad status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(galacticad tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.galactica/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025agnet\"/" $HOME/.galactica/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.galactica/config/config.toml
```

### Reset Chain Data

```bash
galacticad tendermint unsafe-reset-all --home $HOME/.galactica --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop galacticad && sudo systemctl disable galacticad && sudo rm /etc/systemd/system/galacticad.service && sudo systemctl daemon-reload && sudo rm -rf $(which galacticad) && rm -rf $HOME/.galactica
```

</TabItem>

</Tabs>
