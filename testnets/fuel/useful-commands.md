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

<div className="h1-with-icon icon-fuel">
# Fuel Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `seq-testnet-2` | Node Version: `seq-testnet-2.2`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export FUEL_CHAIN_ID="seq-testnet-2"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
fuelsequencerd keys add wallet
```

### Recovery Wallet

```bash
fuelsequencerd keys add wallet --recover
```

### List All Wallet

```bash
fuelsequencerd keys list
```

### Delete Wallet

```bash
fuelsequencerd keys delete wallet
```

### Check Wallet Balance

```bash
fuelsequencerd q bank balances $(fuelsequencerd keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
fuelsequencerd tx staking create-validator \
--amount=1000000fuel \
--pubkey=$(fuelsequencerd tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$FUEL_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=10fuel
```

### Edit Validator

```bash
fuelsequencerd tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$FUEL_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=10fuel
```

### Check Jailed Reason

```bash
fuelsequencerd query slashing signing-info $(fuelsequencerd tendermint show-validator)
```

### Unjail Validator

```bash
fuelsequencerd tx slashing unjail --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
fuelsequencerd tx distribution withdraw-all-rewards --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

### Withdraw Rewards with Comission

```bash
fuelsequencerd tx distribution withdraw-rewards $(fuelsequencerd keys show wallet --bech val -a) --commission --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

### Delegate Tokens to Your Validator

```bash
fuelsequencerd tx staking delegate $(fuelsequencerd keys show wallet --bech val -a) 100000fuel --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

### Redelegate Tokens to Another Validator

```bash
fuelsequencerd tx staking redelegate $(fuelsequencerd keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000fuel --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

### Unbond Tokens from Your Validator

```bash
fuelsequencerd tx staking unbond $(fuelsequencerd keys show wallet --bech val -a) 100000fuel --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

### Send Tokens to Any Wallet

```bash
fuelsequencerd tx bank send wallet <TO_WALLET_ADDRESS> 100000fuel --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
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
sudo systemctl enable fuelsequencerd
```

### Disable Service

```bash
sudo systemctl disable fuelsequencerd
```

### Start Service

```bash
sudo systemctl start fuelsequencerd
```

### Stop Service

```bash
sudo systemctl stop fuelsequencerd
```

### Restart Service

```bash
sudo systemctl restart fuelsequencerd
```

### Check Service Status

```bash
sudo systemctl status fuelsequencerd
```

### Check Service Logs

```bash
sudo journalctl -u fuelsequencerd -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
fuelsequencerd tx gov vote 1 yes --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

### List all Proposals

```bash
fuelsequencerd query gov proposals
```

### Check Vote

```bash
fuelsequencerd tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $FUEL_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 10fuel -y
```

### Create new Proposal

```bash
fuelsequencerd tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000fuel \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=10fuel \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.fuelsequencer/config/config.toml
```

### Get Validator Info

```bash
fuelsequencerd status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
fuelsequencerd q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
fuelsequencerd status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
fuelsequencerd status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(fuelsequencerd tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.fuelsequencer/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"10fuel\"/" $HOME/.fuelsequencer/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.fuelsequencer/config/config.toml
```

### Reset Chain Data

```bash
fuelsequencerd tendermint unsafe-reset-all --home $HOME/.fuelsequencer --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop fuelsequencerd && sudo systemctl disable fuelsequencerd && sudo rm /etc/systemd/system/fuelsequencerd.service && sudo systemctl daemon-reload && sudo rm -rf $(which fuelsequencerd) && rm -rf $HOME/.fuelsequencer
```

</TabItem>

</Tabs>
