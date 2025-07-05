---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-regen">
# Regen Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `regen-1` | Node Version: `v5.1.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export REGEN_CHAIN_ID="regen-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
regen keys add wallet
```

### Recovery Wallet

```bash
regen keys add wallet --recover
```

### List All Wallet

```bash
regen keys list
```

### Delete Wallet

```bash
regen keys delete wallet
```

### Check Wallet Balance

```bash
regen q bank balances $(regen keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
regen tx staking create-validator \
--amount=1000000uregen \
--pubkey=$(regen tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$REGEN_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uregen
```

### Edit Validator

```bash
regen tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$REGEN_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uregen
```

### Check Jailed Reason

```bash
regen query slashing signing-info $(regen tendermint show-validator)
```

### Unjail Validator

```bash
regen tx slashing unjail --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
regen tx distribution withdraw-all-rewards --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

### Withdraw Rewards with Comission

```bash
regen tx distribution withdraw-rewards $(regen keys show wallet --bech val -a) --commission --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

### Delegate Tokens to Your Validator

```bash
regen tx staking delegate $(regen keys show wallet --bech val -a) 100000uregen --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

### Redelegate Tokens to Another Validator

```bash
regen tx staking redelegate $(regen keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000uregen --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

### Unbond Tokens from Your Validator

```bash
regen tx staking unbond $(regen keys show wallet --bech val -a) 100000uregen --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

### Send Tokens to Any Wallet

```bash
regen tx bank send wallet <TO_WALLET_ADDRESS> 100000uregen --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
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
sudo systemctl enable regen
```

### Disable Service

```bash
sudo systemctl disable regen
```

### Start Service

```bash
sudo systemctl start regen
```

### Stop Service

```bash
sudo systemctl stop regen
```

### Restart Service

```bash
sudo systemctl restart regen
```

### Check Service Status

```bash
sudo systemctl status regen
```

### Check Service Logs

```bash
sudo journalctl -u regen -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
regen tx gov vote 1 yes --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

### List all Proposals

```bash
regen query gov proposals
```

### Check Vote

```bash
regen tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $REGEN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uregen -y
```

### Create new Proposal

```bash
regen tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uregen \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1uregen \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.regen/config/config.toml
```

### Get Validator Info

```bash
regen status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
regen q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
regen status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
regen status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(regen tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.regen/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025uregen\"/" $HOME/.regen/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.regen/config/config.toml
```

### Reset Chain Data

```bash
regen tendermint unsafe-reset-all --home $HOME/.regen --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop regen && sudo systemctl disable regen && sudo rm /etc/systemd/system/regen.service && sudo systemctl daemon-reload && sudo rm -rf $(which regen) && rm -rf $HOME/.regen
```

</TabItem>

</Tabs>
