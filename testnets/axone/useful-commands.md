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

<div className="h1-with-icon icon-axone">
# Axone Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `axone-dentrite-1` | Node Version: `v10.0.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export AXONE_TEST_CHAIN_ID="axone-dentrite-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
axoned keys add wallet
```

### Recovery Wallet

```bash
axoned keys add wallet --recover
```

### List All Wallet

```bash
axoned keys list
```

### Delete Wallet

```bash
axoned keys delete wallet
```

### Check Wallet Balance

```bash
axoned q bank balances $(axoned keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
axoned tx staking create-validator \
--amount=1000000uaxone \
--pubkey=$(axoned tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$HIPPO_TESTNET_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.01uaxone
```

### Edit Validator

```bash
axoned tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$HIPPO_TESTNET_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.01uaxone
```

### Check Jailed Reason

```bash
axoned query slashing signing-info $(axoned tendermint show-validator)
```

### Unjail Validator

```bash
axoned tx slashing unjail --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
axoned tx distribution withdraw-all-rewards --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

### Withdraw Rewards with Comission

```bash
axoned tx distribution withdraw-rewards $(axoned keys show wallet --bech val -a) --commission --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

### Delegate Tokens to Your Validator

```bash
axoned tx staking delegate $(axoned keys show wallet --bech val -a) 1000000uaxone --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

### Redelegate Tokens to Another Validator

```bash
axoned tx staking redelegate $(axoned keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000uaxone --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

### Unbond Tokens from Your Validator

```bash
axoned tx staking unbond $(axoned keys show wallet --bech val -a) 1000000uaxone --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

### Send Tokens to Any Wallet

```bash
axoned tx bank send wallet <TO_WALLET_ADDRESS> 1000000uaxone --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
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
sudo systemctl enable axoned
```

### Disable Service

```bash
sudo systemctl disable axoned
```

### Start Service

```bash
sudo systemctl start axoned
```

### Stop Service

```bash
sudo systemctl stop axoned
```

### Restart Service

```bash
sudo systemctl restart axoned
```

### Check Service Status

```bash
sudo systemctl status axoned
```

### Check Service Logs

```bash
sudo journalctl -u axoned -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
axoned tx gov vote 1 yes --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

### List all Proposals

```bash
axoned query gov proposals
```

### Check Vote

```bash
axoned tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $HIPPO_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uaxone -y
```

### Create new Proposal

```bash
axoned tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uaxone \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.01uaxone \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.axoned/config/config.toml
```

### Get Validator Info

```bash
axoned status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
axoned q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
axoned status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
axoned status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(axoned tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.axoned/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.01uaxone\"/" $HOME/.axoned/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.axoned/config/config.toml
```

### Reset Chain Data

```bash
axoned tendermint unsafe-reset-all --home $HOME/.axoned --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop axoned && sudo systemctl disable axoned && sudo rm /etc/systemd/system/axoned.service && sudo systemctl daemon-reload && sudo rm -rf $(which axoned) && rm -rf $HOME/.axoned
```

</TabItem>

</Tabs>
