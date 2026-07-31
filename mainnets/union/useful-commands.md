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

<div className="h1-with-icon icon-union">
# Union Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `union-1` | Node Version: `v1.2.2`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export UNION_CHAIN_ID="union-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
uniond keys add wallet
```

### Recovery Wallet

```bash
uniond keys add wallet --recover
```

### List All Wallet

```bash
uniond keys list
```

### Delete Wallet

```bash
uniond keys delete wallet
```

### Check Wallet Balance

```bash
uniond q bank balances $(uniond keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
uniond tx staking create-validator \
--amount=1000000000000000000au \
--pubkey=$(uniond tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$UNION_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=100000000au
```

### Edit Validator

```bash
uniond tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$UNION_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=100000000au
```

### Check Jailed Reason

```bash
uniond query slashing signing-info $(uniond tendermint show-validator)
```

### Unjail Validator

```bash
uniond tx slashing unjail --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
uniond tx distribution withdraw-all-rewards --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

### Withdraw Rewards with Comission

```bash
uniond tx distribution withdraw-rewards $(uniond keys show wallet --bech val -a) --commission --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

### Delegate Tokens to Your Validator

```bash
uniond tx staking delegate $(uniond keys show wallet --bech val -a) 1000000000000000000au --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

### Redelegate Tokens to Another Validator

```bash
uniond tx staking redelegate $(uniond keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000000000000000au --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

### Unbond Tokens from Your Validator

```bash
uniond tx staking unbond $(uniond keys show wallet --bech val -a) 1000000000000000000au --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

### Send Tokens to Any Wallet

```bash
uniond tx bank send wallet <TO_WALLET_ADDRESS> 1000000000000000000au --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
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
sudo systemctl enable uniond
```

### Disable Service

```bash
sudo systemctl disable uniond
```

### Start Service

```bash
sudo systemctl start uniond
```

### Stop Service

```bash
sudo systemctl stop uniond
```

### Restart Service

```bash
sudo systemctl restart uniond
```

### Check Service Status

```bash
sudo systemctl status uniond
```

### Check Service Logs

```bash
sudo journalctl -u uniond -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
uniond tx gov vote 1 yes --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

### List all Proposals

```bash
uniond query gov proposals
```

### Check Vote

```bash
uniond tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $UNION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000au -y
```

### Create new Proposal

```bash
uniond tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000unil \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=100000000au \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.union/config/config.toml
```

### Get Validator Info

```bash
uniond status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
uniond q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
uniond status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
uniond status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(uniond tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.union/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"100000000au\"/" $HOME/.union/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.union/config/config.toml
```

### Reset Chain Data

```bash
uniond tendermint unsafe-reset-all --home $HOME/.union --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop uniond && sudo systemctl disable uniond && sudo rm /etc/systemd/system/uniond.service && sudo systemctl daemon-reload && sudo rm -rf $(which uniond) && rm -rf $HOME/.union
```

</TabItem>

</Tabs>
