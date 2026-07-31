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

<div className="h1-with-icon icon-provenance">
# Provenance Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `pio-mainnet-1` | Node Version: `v1.25.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export PROVENANCE_CHAIN_ID="pio-mainnet-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
provenanced keys add wallet
```

### Recovery Wallet

```bash
provenanced keys add wallet --recover
```

### List All Wallet

```bash
provenanced keys list
```

### Delete Wallet

```bash
provenanced keys delete wallet
```

### Check Wallet Balance

```bash
provenanced q bank balances $(provenanced keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
provenanced tx staking create-validator \
--amount=1000000nhash \
--pubkey=$(provenanced tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$PROVENANCE_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1905nhash
```

### Edit Validator

```bash
provenanced tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$PROVENANCE_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1905nhash
```

### Check Jailed Reason

```bash
provenanced query slashing signing-info $(provenanced tendermint show-validator)
```

### Unjail Validator

```bash
provenanced tx slashing unjail --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
provenanced tx distribution withdraw-all-rewards --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

### Withdraw Rewards with Comission

```bash
provenanced tx distribution withdraw-rewards $(provenanced keys show wallet --bech val -a) --commission --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

### Delegate Tokens to Your Validator

```bash
provenanced tx staking delegate $(provenanced keys show wallet --bech val -a) 100000nhash --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

### Redelegate Tokens to Another Validator

```bash
provenanced tx staking redelegate $(provenanced keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000nhash --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

### Unbond Tokens from Your Validator

```bash
provenanced tx staking unbond $(provenanced keys show wallet --bech val -a) 100000nhash --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

### Send Tokens to Any Wallet

```bash
provenanced tx bank send wallet <TO_WALLET_ADDRESS> 100000nhash --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
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
sudo systemctl enable provenanced
```

### Disable Service

```bash
sudo systemctl disable provenanced
```

### Start Service

```bash
sudo systemctl start provenanced
```

### Stop Service

```bash
sudo systemctl stop provenanced
```

### Restart Service

```bash
sudo systemctl restart provenanced
```

### Check Service Status

```bash
sudo systemctl status provenanced
```

### Check Service Logs

```bash
sudo journalctl -u provenanced -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
provenanced tx gov vote 1 yes --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

### List all Proposals

```bash
provenanced query gov proposals
```

### Check Vote

```bash
provenanced tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $PROVENANCE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1905nhash -y
```

### Create new Proposal

```bash
provenanced tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000nhash \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1905nhash \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.provenanced/config/config.toml
```

### Get Validator Info

```bash
provenanced status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
provenanced q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
provenanced status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
provenanced status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(provenanced tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.provenanced/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"1905nhash\"/" $HOME/.provenanced/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.provenanced/config/config.toml
```

### Reset Chain Data

```bash
provenanced tendermint unsafe-reset-all --home $HOME/.provenanced --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop provenanced && sudo systemctl disable provenanced && sudo rm /etc/systemd/system/provenanced.service && sudo systemctl daemon-reload && sudo rm -rf $(which provenanced) && rm -rf $HOME/.provenanced
```

</TabItem>

</Tabs>
