---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-lava">
# Lava Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `lava-mainnet-1` | Node Version: `v4.1.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export LAVA_CHAIN_ID="lava-mainnet-1" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
lavad keys add wallet
```

### Recovery Wallet

```bash
lavad keys add wallet --recover
```

### List All Wallet

```bash
lavad keys list
```

### Delete Wallet

```bash
lavad keys delete wallet
```

### Check Wallet Balance

```bash
lavad q bank balances $(lavad keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
lavad tx staking create-validator \
--amount=1000000ulava \
--pubkey=$(lavad tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$LAVA_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.00002ulava
```

### Edit Validator

```bash
lavad tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$LAVA_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.00002ulava
```

### Check Jailed Reason

```bash
lavad query slashing signing-info $(lavad tendermint show-validator)
```

### Unjail Validator

```bash
lavad tx slashing unjail --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
lavad tx distribution withdraw-all-rewards --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

### Withdraw Rewards with Comission

```bash
lavad tx distribution withdraw-rewards $(lavad keys show wallet --bech val -a) --commission --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

### Delegate Tokens to Your Validator

```bash
lavad tx staking delegate $(lavad keys show wallet --bech val -a) 1000000ulava --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

### Redelegate Tokens to Another Validator

```bash
lavad tx staking redelegate $(lavad keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000ulava --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

### Unbond Tokens from Your Validator

```bash
lavad tx staking unbond $(lavad keys show wallet --bech val -a) 1000000ulava --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

### Send Tokens to Any Wallet

```bash
lavad tx bank send wallet <TO_WALLET_ADDRESS> 1000000ulava --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
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
sudo systemctl enable lavad
```

### Disable Service

```bash
sudo systemctl disable lavad
```

### Start Service

```bash
sudo systemctl start lavad
```

### Stop Service

```bash
sudo systemctl stop lavad
```

### Restart Service

```bash
sudo systemctl restart lavad
```

### Check Service Status

```bash
sudo systemctl status lavad
```

### Check Service Logs

```bash
sudo journalctl -u lavad -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
lavad tx gov vote 1 yes --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

### List all Proposals

```bash
lavad query gov proposals
```

### Check Vote

```bash
lavad tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $LAVA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.00002ulava -y
```

### Create new Proposal

```bash
lavad tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000ulava \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.00002ulava \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.lava/config/config.toml
```

### Get Validator Info

```bash
lavad status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
lavad q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
lavad status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
lavad status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(lavad tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.lava/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.00002ulava\"/" $HOME/.lava/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.lava/config/config.toml
```

### Reset Chain Data

```bash
lavad tendermint unsafe-reset-all --home $HOME/.lava --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop lavad && sudo systemctl disable lavad && sudo rm /etc/systemd/system/lavad.service && sudo systemctl daemon-reload && sudo rm -rf $(which lavad) && rm -rf $HOME/.lava
```

</TabItem>

</Tabs>
