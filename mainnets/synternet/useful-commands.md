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

<div className="h1-with-icon icon-synternet">
# Synternet Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `synternet-1` | Node Version: `v0.25`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SYNTERNET_CHAIN_ID="synternet-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
syntd keys add wallet
```

### Recovery Wallet

```bash
syntd keys add wallet --recover
```

### List All Wallet

```bash
syntd keys list
```

### Delete Wallet

```bash
syntd keys delete wallet
```

### Check Wallet Balance

```bash
syntd q bank balances $(syntd keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
syntd tx staking create-validator \
--amount=1000000usynt \
--pubkey=$(syntd tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$SYNTERNET_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.01usynt
```

### Edit Validator

```bash
syntd tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$SYNTERNET_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.01usynt
```

### Check Jailed Reason

```bash
syntd query slashing signing-info $(syntd tendermint show-validator)
```

### Unjail Validator

```bash
syntd tx slashing unjail --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
syntd tx distribution withdraw-all-rewards --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

### Withdraw Rewards with Comission

```bash
syntd tx distribution withdraw-rewards $(syntd keys show wallet --bech val -a) --commission --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

### Delegate Tokens to Your Validator

```bash
syntd tx staking delegate $(syntd keys show wallet --bech val -a) 100000usynt --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

### Redelegate Tokens to Another Validator

```bash
syntd tx staking redelegate $(syntd keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000usynt --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

### Unbond Tokens from Your Validator

```bash
syntd tx staking unbond $(syntd keys show wallet --bech val -a) 100000usynt --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

### Send Tokens to Any Wallet

```bash
syntd tx bank send wallet <TO_WALLET_ADDRESS> 100000usynt --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
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
sudo systemctl enable syntd
```

### Disable Service

```bash
sudo systemctl disable syntd
```

### Start Service

```bash
sudo systemctl start syntd
```

### Stop Service

```bash
sudo systemctl stop syntd
```

### Restart Service

```bash
sudo systemctl restart syntd
```

### Check Service Status

```bash
sudo systemctl status syntd
```

### Check Service Logs

```bash
sudo journalctl -u syntd -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
syntd tx gov vote 1 yes --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

### List all Proposals

```bash
syntd query gov proposals
```

### Check Vote

```bash
syntd tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $SYNTERNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01usynt -y
```

### Create new Proposal

```bash
syntd tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000usynt \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.01usynt \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.amber/config/config.toml
```

### Get Validator Info

```bash
syntd status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
syntd q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
syntd status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
syntd status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(syntd tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.amber/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.01usynt\"/" $HOME/.amber/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.amber/config/config.toml
```

### Reset Chain Data

```bash
syntd tendermint unsafe-reset-all --home $HOME/.amber --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop syntd && sudo systemctl disable syntd && sudo rm /etc/systemd/system/syntd.service && sudo systemctl daemon-reload && sudo rm -rf $(which syntd) && rm -rf $HOME/.amber
```

</TabItem>

</Tabs>
