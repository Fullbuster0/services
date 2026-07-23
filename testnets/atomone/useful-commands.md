---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-atomone">
# Atomone Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `atomone-testnet-1` | Node Version: `v4`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export ATOMONE_CHAIN_ID="atomone-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
atomoned keys add wallet
```

### Recovery Wallet

```bash
atomoned keys add wallet --recover
```

### List All Wallet

```bash
atomoned keys list
```

### Delete Wallet

```bash
atomoned keys delete wallet
```

### Check Wallet Balance

```bash
atomoned q bank balances $(atomoned keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
atomoned tx staking create-validator \
--amount=1000000uatone \
--pubkey=$(atomoned tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$ATOMONE_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uatone
```

### Edit Validator

```bash
atomoned tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$ATOMONE_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uatone
```

### Check Jailed Reason

```bash
atomoned query slashing signing-info $(atomoned tendermint show-validator)
```

### Unjail Validator

```bash
atomoned tx slashing unjail --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
atomoned tx distribution withdraw-all-rewards --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

### Withdraw Rewards with Comission

```bash
atomoned tx distribution withdraw-rewards $(atomoned keys show wallet --bech val -a) --commission --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

### Delegate Tokens to Your Validator

```bash
atomoned tx staking delegate $(atomoned keys show wallet --bech val -a) 100000uatone --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

### Redelegate Tokens to Another Validator

```bash
atomoned tx staking redelegate $(atomoned keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000uatone --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

### Unbond Tokens from Your Validator

```bash
atomoned tx staking unbond $(atomoned keys show wallet --bech val -a) 100000uatone --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

### Send Tokens to Any Wallet

```bash
atomoned tx bank send wallet <TO_WALLET_ADDRESS> 100000uatone --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
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
sudo systemctl enable atomoned
```

### Disable Service

```bash
sudo systemctl disable atomoned
```

### Start Service

```bash
sudo systemctl start atomoned
```

### Stop Service

```bash
sudo systemctl stop atomoned
```

### Restart Service

```bash
sudo systemctl restart atomoned
```

### Check Service Status

```bash
sudo systemctl status atomoned
```

### Check Service Logs

```bash
sudo journalctl -u atomoned -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
atomoned tx gov vote 1 yes --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

### List all Proposals

```bash
atomoned query gov proposals
```

### Check Vote

```bash
atomoned tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $ATOMONE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uatone -y
```

### Create new Proposal

```bash
atomoned tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uatone \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1uatone \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.atomone/config/config.toml
```

### Get Validator Info

```bash
atomoned status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
atomoned q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
atomoned status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
atomoned status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(atomoned tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.atomone/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025uatone\"/" $HOME/.atomone/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.atomone/config/config.toml
```

### Reset Chain Data

```bash
atomoned tendermint unsafe-reset-all --home $HOME/.atomone --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop atomoned && sudo systemctl disable atomoned && sudo rm /etc/systemd/system/atomoned.service && sudo systemctl daemon-reload && sudo rm -rf $(which atomoned) && rm -rf $HOME/.atomone
```

</TabItem>

</Tabs>
