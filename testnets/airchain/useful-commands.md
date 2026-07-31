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

<div className="h1-with-icon icon-airchain">
# Airchain Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `varanasi-1` | Node Version: `v0.3.2`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export AIR_CHAIN_ID="varanasi-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
junctiond keys add wallet
```

### Recovery Wallet

```bash
junctiond keys add wallet --recover
```

### List All Wallet

```bash
junctiond keys list
```

### Delete Wallet

```bash
junctiond keys delete wallet
```

### Check Wallet Balance

```bash
junctiond q bank balances $(junctiond keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
junctiond tx staking create-validator \
--amount=1000000uamf \
--pubkey=$(junctiond tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$AIR_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uamf
```

### Edit Validator

```bash
junctiond tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$AIR_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uamf
```

### Check Jailed Reason

```bash
junctiond query slashing signing-info $(junctiond tendermint show-validator)
```

### Unjail Validator

```bash
junctiond tx slashing unjail --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
junctiond tx distribution withdraw-all-rewards --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

### Withdraw Rewards with Comission

```bash
junctiond tx distribution withdraw-rewards $(junctiond keys show wallet --bech val -a) --commission --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

### Delegate Tokens to Your Validator

```bash
junctiond tx staking delegate $(junctiond keys show wallet --bech val -a) 100000uamf --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

### Redelegate Tokens to Another Validator

```bash
junctiond tx staking redelegate $(junctiond keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000uamf --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

### Unbond Tokens from Your Validator

```bash
junctiond tx staking unbond $(junctiond keys show wallet --bech val -a) 100000uamf --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

### Send Tokens to Any Wallet

```bash
junctiond tx bank send wallet <TO_WALLET_ADDRESS> 100000uamf --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
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
sudo systemctl enable junctiond
```

### Disable Service

```bash
sudo systemctl disable junctiond
```

### Start Service

```bash
sudo systemctl start junctiond
```

### Stop Service

```bash
sudo systemctl stop junctiond
```

### Restart Service

```bash
sudo systemctl restart junctiond
```

### Check Service Status

```bash
sudo systemctl status junctiond
```

### Check Service Logs

```bash
sudo journalctl -u junctiond -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
junctiond tx gov vote 1 yes --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

### List all Proposals

```bash
junctiond query gov proposals
```

### Check Vote

```bash
junctiond tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $AIR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uamf -y
```

### Create new Proposal

```bash
junctiond tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uamf \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1uamf \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.junctiond/config/config.toml
```

### Get Validator Info

```bash
junctiond status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
junctiond q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
junctiond status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
junctiond status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(junctiond tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.junctiond/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025uamf\"/" $HOME/.junctiond/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.junctiond/config/config.toml
```

### Reset Chain Data

```bash
junctiond tendermint unsafe-reset-all --home $HOME/.junctiond --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop junctiond && sudo systemctl disable junctiond && sudo rm /etc/systemd/system/junctiond.service && sudo systemctl daemon-reload && sudo rm -rf $(which junctiond) && rm -rf $HOME/.junctiond
```

</TabItem>

</Tabs>
