---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-warden">
# Warden Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `barra_9191-1` | Node Version: `v0.7.0-rc3`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export WARDEN_CHAIN_ID="barra_9191-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
wardend keys add wallet
```

### Recovery Wallet

```bash
wardend keys add wallet --recover
```

### List All Wallet

```bash
wardend keys list
```

### Delete Wallet

```bash
wardend keys delete wallet
```

### Check Wallet Balance

```bash
wardend q bank balances $(wardend keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
wardend tx staking create-validator \
--amount=1000000000000000000award \
--pubkey=$(wardend tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$WARDEN_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=10award
```

### Edit Validator

```bash
wardend tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$WARDEN_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=10award
```

### Check Jailed Reason

```bash
wardend query slashing signing-info $(wardend tendermint show-validator)
```

### Unjail Validator

```bash
wardend tx slashing unjail --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
wardend tx distribution withdraw-all-rewards --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

### Withdraw Rewards with Comission

```bash
wardend tx distribution withdraw-rewards $(wardend keys show wallet --bech val -a) --commission --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

### Delegate Tokens to Your Validator

```bash
wardend tx staking delegate $(wardend keys show wallet --bech val -a) 1000000000000000000award --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

### Redelegate Tokens to Another Validator

```bash
wardend tx staking redelegate $(wardend keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000000000000000award --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

### Unbond Tokens from Your Validator

```bash
wardend tx staking unbond $(wardend keys show wallet --bech val -a) 1000000000000000000award --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

### Send Tokens to Any Wallet

```bash
wardend tx bank send wallet <TO_WALLET_ADDRESS> 1000000000000000000award --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
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
sudo systemctl enable wardend
```

### Disable Service

```bash
sudo systemctl disable wardend
```

### Start Service

```bash
sudo systemctl start wardend
```

### Stop Service

```bash
sudo systemctl stop wardend
```

### Restart Service

```bash
sudo systemctl restart wardend
```

### Check Service Status

```bash
sudo systemctl status wardend
```

### Check Service Logs

```bash
sudo journalctl -u wardend -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
wardend tx gov vote 1 yes --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

### List all Proposals

```bash
wardend query gov proposals
```

### Check Vote

```bash
wardend tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $WARDEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10award -y
```

### Create new Proposal

```bash
wardend tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=1000000000000000000award \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=10award \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.warden/config/config.toml
```

### Get Validator Info

```bash
wardend status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
wardend q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
wardend status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
wardend status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(wardend tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.warden/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025award\"/" $HOME/.warden/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.warden/config/config.toml
```

### Reset Chain Data

```bash
wardend tendermint unsafe-reset-all --home $HOME/.warden --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop wardend && sudo systemctl disable wardend && sudo rm /etc/systemd/system/wardend.service && sudo systemctl daemon-reload && sudo rm -rf $(which wardend) && rm -rf $HOME/.warden
```

</TabItem>

</Tabs>
