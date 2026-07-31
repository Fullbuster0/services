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

<div className="h1-with-icon icon-lumera">
# Lumera Protocol Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `lumera-mainnet-1` | Node Version: `v1.6.1`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export LUMERA_CHAIN_ID="lumera-mainnet-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
lumerad keys add wallet
```

### Recovery Wallet

```bash
lumerad keys add wallet --recover
```

### List All Wallet

```bash
lumerad keys list
```

### Delete Wallet

```bash
lumerad keys delete wallet
```

### Check Wallet Balance

```bash
lumerad q bank balances $(lumerad keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
lumerad tx staking create-validator \
--amount=1000000ulume \
--pubkey=$(lumerad tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$LUMERA_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.025ulume
```

### Edit Validator

```bash
lumerad tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$LUMERA_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.025ulume
```

### Check Jailed Reason

```bash
lumerad query slashing signing-info $(lumerad tendermint show-validator)
```

### Unjail Validator

```bash
lumerad tx slashing unjail --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
lumerad tx distribution withdraw-all-rewards --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Withdraw Rewards with Comission

```bash
lumerad tx distribution withdraw-rewards $(lumerad keys show wallet --bech val -a) --commission --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Delegate Tokens to Your Validator

```bash
lumerad tx staking delegate $(lumerad keys show wallet --bech val -a) 1000000ulume --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Redelegate Tokens to Another Validator

```bash
lumerad tx staking redelegate $(lumerad keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000ulume --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Unbond Tokens from Your Validator

```bash
lumerad tx staking unbond $(lumerad keys show wallet --bech val -a) 1000000ulume --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Send Tokens to Any Wallet

```bash
lumerad tx bank send wallet <TO_WALLET_ADDRESS> 1000000ulume --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
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
sudo systemctl enable lumerad
```

### Disable Service

```bash
sudo systemctl disable lumerad
```

### Start Service

```bash
sudo systemctl start lumerad
```

### Stop Service

```bash
sudo systemctl stop lumerad
```

### Restart Service

```bash
sudo systemctl restart lumerad
```

### Check Service Status

```bash
sudo systemctl status lumerad
```

### Check Service Logs

```bash
sudo journalctl -u lumerad -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
lumerad tx gov vote 1 yes --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### List all Proposals

```bash
lumerad query gov proposals
```

### Check Vote

```bash
lumerad tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $LUMERA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025ulume -y
```

### Create new Proposal

```bash
lumerad tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uaxone \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.025ulume \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.lumera/config/config.toml
```

### Get Validator Info

```bash
lumerad status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
lumerad q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
lumerad status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
lumerad status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(lumerad tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.lumera/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.025ulume\"/" $HOME/.lumera/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.lumera/config/config.toml
```

### Reset Chain Data

```bash
lumerad tendermint unsafe-reset-all --home $HOME/.lumera --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop lumerad && sudo systemctl disable lumerad && sudo rm /etc/systemd/system/lumerad.service && sudo systemctl daemon-reload && sudo rm -rf $(which lumerad) && rm -rf $HOME/.lumera
```

</TabItem>

</Tabs>
