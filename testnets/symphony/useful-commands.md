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

<div className="h1-with-icon icon-symphony">
# Symphony Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `symphony-testnet-4` | Node Version: `v5testnet`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SYMPHONY_CHAIN_ID="symphony-testnet-4"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
symphonyd keys add wallet
```

### Recovery Wallet

```bash
symphonyd keys add wallet --recover
```

### List All Wallet

```bash
symphonyd keys list
```

### Delete Wallet

```bash
symphonyd keys delete wallet
```

### Check Wallet Balance

```bash
symphonyd q bank balances $(symphonyd keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
symphonyd tx staking create-validator \
--amount=1000000note \
--pubkey=$(symphonyd tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$SYMPHONY_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1note
```

### Edit Validator

```bash
symphonyd tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$SYMPHONY_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1note
```

### Check Jailed Reason

```bash
symphonyd query slashing signing-info $(symphonyd tendermint show-validator)
```

### Unjail Validator

```bash
symphonyd tx slashing unjail --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
symphonyd tx distribution withdraw-all-rewards --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

### Withdraw Rewards with Comission

```bash
symphonyd tx distribution withdraw-rewards $(symphonyd keys show wallet --bech val -a) --commission --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

### Delegate Tokens to Your Validator

```bash
symphonyd tx staking delegate $(symphonyd keys show wallet --bech val -a) 100000note --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

### Redelegate Tokens to Another Validator

```bash
symphonyd tx staking redelegate $(symphonyd keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000note --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

### Unbond Tokens from Your Validator

```bash
symphonyd tx staking unbond $(symphonyd keys show wallet --bech val -a) 100000note --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

### Send Tokens to Any Wallet

```bash
symphonyd tx bank send wallet <TO_WALLET_ADDRESS> 100000note --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
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
sudo systemctl enable symphonyd
```

### Disable Service

```bash
sudo systemctl disable symphonyd
```

### Start Service

```bash
sudo systemctl start symphonyd
```

### Stop Service

```bash
sudo systemctl stop symphonyd
```

### Restart Service

```bash
sudo systemctl restart symphonyd
```

### Check Service Status

```bash
sudo systemctl status symphonyd
```

### Check Service Logs

```bash
sudo journalctl -u symphonyd -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
symphonyd tx gov vote 1 yes --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

### List all Proposals

```bash
symphonyd query gov proposals
```

### Check Vote

```bash
symphonyd tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $SYMPHONY_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1note -y
```

### Create new Proposal

```bash
symphonyd tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000note \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1note \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.symphonyd/config/config.toml
```

### Get Validator Info

```bash
symphonyd status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
symphonyd q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
symphonyd status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
symphonyd status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(symphonyd tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.symphonyd/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025note\"/" $HOME/.symphonyd/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.symphonyd/config/config.toml
```

### Reset Chain Data

```bash
symphonyd tendermint unsafe-reset-all --home $HOME/.symphonyd --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop symphonyd && sudo systemctl disable symphonyd && sudo rm /etc/systemd/system/symphonyd.service && sudo systemctl daemon-reload && sudo rm -rf $(which symphonyd) && rm -rf $HOME/.symphonyd
```

</TabItem>

</Tabs>
