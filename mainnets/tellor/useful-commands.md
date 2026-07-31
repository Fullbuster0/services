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

<div className="h1-with-icon icon-tellor">
# Tellor Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `tellor-1` | Node Version: `v5.1.1`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export TELLOR_CHAIN_ID="tellor-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
layerd keys add wallet
```

### Recovery Wallet

```bash
layerd keys add wallet --recover
```

### List All Wallet

```bash
layerd keys list
```

### Delete Wallet

```bash
layerd keys delete wallet
```

### Check Wallet Balance

```bash
layerd q bank balances $(layerd keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
layerd tx staking create-validator \
--amount=1000000loya \
--pubkey=$(layerd tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$TELLOR_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.001loya
```

### Edit Validator

```bash
layerd tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$TELLOR_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.001loya
```

### Check Jailed Reason

```bash
layerd query slashing signing-info $(layerd tendermint show-validator)
```

### Unjail Validator

```bash
layerd tx slashing unjail --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
layerd tx distribution withdraw-all-rewards --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

### Withdraw Rewards with Comission

```bash
layerd tx distribution withdraw-rewards $(layerd keys show wallet --bech val -a) --commission --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

### Delegate Tokens to Your Validator

```bash
layerd tx staking delegate $(layerd keys show wallet --bech val -a) 1000000loya --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

### Redelegate Tokens to Another Validator

```bash
layerd tx staking redelegate $(layerd keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000loya --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

### Unbond Tokens from Your Validator

```bash
layerd tx staking unbond $(layerd keys show wallet --bech val -a) 1000000loya --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

### Send Tokens to Any Wallet

```bash
layerd tx bank send wallet <TO_WALLET_ADDRESS> 1000000loya --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
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
sudo systemctl enable layerd
```

### Disable Service

```bash
sudo systemctl disable layerd
```

### Start Service

```bash
sudo systemctl start layerd
```

### Stop Service

```bash
sudo systemctl stop layerd
```

### Restart Service

```bash
sudo systemctl restart layerd
```

### Check Service Status

```bash
sudo systemctl status layerd
```

### Check Service Logs

```bash
sudo journalctl -u layerd -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
layerd tx gov vote 1 yes --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

### List all Proposals

```bash
layerd query gov proposals
```

### Check Vote

```bash
layerd tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $TELLOR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.001loya -y
```

### Create new Proposal

```bash
layerd tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000loya \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.001loya \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.layer/config/config.toml
```

### Get Validator Info

```bash
layerd status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
layerd q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
layerd status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
layerd status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(layerd tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.layer/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.001loya\"/" $HOME/.layer/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.layer/config/config.toml
```

### Reset Chain Data

```bash
layerd tendermint unsafe-reset-all --home $HOME/.layer --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop layerd && sudo systemctl disable layerd && sudo rm /etc/systemd/system/layerd.service && sudo systemctl daemon-reload && sudo rm -rf $(which layerd) && rm -rf $HOME/.layer
```

</TabItem>

</Tabs>
