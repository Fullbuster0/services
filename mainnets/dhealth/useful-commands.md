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

<div className="h1-with-icon icon-dhealth">
# Dhealth Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `dhealth` | Node Version: `v1.0.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export DHEALTH_CHAIN_ID="dhealth"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
dhealthd keys add wallet
```

### Recovery Wallet

```bash
dhealthd keys add wallet --recover
```

### List All Wallet

```bash
dhealthd keys list
```

### Delete Wallet

```bash
dhealthd keys delete wallet
```

### Check Wallet Balance

```bash
dhealthd q bank balances $(dhealthd keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
dhealthd tx staking create-validator \
--amount=1000000udhp \
--pubkey=$(dhealthd tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$DHEALTH_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1udhp
```

### Edit Validator

```bash
dhealthd tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$DHEALTH_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1udhp
```

### Check Jailed Reason

```bash
dhealthd query slashing signing-info $(dhealthd tendermint show-validator)
```

### Unjail Validator

```bash
dhealthd tx slashing unjail --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
dhealthd tx distribution withdraw-all-rewards --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

### Withdraw Rewards with Comission

```bash
dhealthd tx distribution withdraw-rewards $(dhealthd keys show wallet --bech val -a) --commission --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

### Delegate Tokens to Your Validator

```bash
dhealthd tx staking delegate $(dhealthd keys show wallet --bech val -a) 100000udhp --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

### Redelegate Tokens to Another Validator

```bash
dhealthd tx staking redelegate $(dhealthd keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000udhp --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

### Unbond Tokens from Your Validator

```bash
dhealthd tx staking unbond $(dhealthd keys show wallet --bech val -a) 100000udhp --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

### Send Tokens to Any Wallet

```bash
dhealthd tx bank send wallet <TO_WALLET_ADDRESS> 100000udhp --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
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
sudo systemctl enable dhealthd
```

### Disable Service

```bash
sudo systemctl disable dhealthd
```

### Start Service

```bash
sudo systemctl start dhealthd
```

### Stop Service

```bash
sudo systemctl stop dhealthd
```

### Restart Service

```bash
sudo systemctl restart dhealthd
```

### Check Service Status

```bash
sudo systemctl status dhealthd
```

### Check Service Logs

```bash
sudo journalctl -u dhealthd -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
dhealthd tx gov vote 1 yes --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

### List all Proposals

```bash
dhealthd query gov proposals
```

### Check Vote

```bash
dhealthd tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $DHEALTH_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1udhp -y
```

### Create new Proposal

```bash
dhealthd tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000udhp \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1udhp \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.dhealth/config/config.toml
```

### Get Validator Info

```bash
dhealthd status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
dhealthd q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
dhealthd status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
dhealthd status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(dhealthd tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.dhealth/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025udhp\"/" $HOME/.dhealth/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.dhealth/config/config.toml
```

### Reset Chain Data

```bash
dhealthd tendermint unsafe-reset-all --home $HOME/.dhealth --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop dhealthd && sudo systemctl disable dhealthd && sudo rm /etc/systemd/system/dhealthd.service && sudo systemctl daemon-reload && sudo rm -rf $(which dhealthd) && rm -rf $HOME/.dhealth
```

</TabItem>

</Tabs>
