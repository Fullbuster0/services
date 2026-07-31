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

<div className="h1-with-icon icon-nillion">
# Nillion Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `nillion-1` | Node Version: `v0.2.5`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export NILLION_CHAIN_ID="nillion-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
nilchaind keys add wallet
```

### Recovery Wallet

```bash
nilchaind keys add wallet --recover
```

### List All Wallet

```bash
nilchaind keys list
```

### Delete Wallet

```bash
nilchaind keys delete wallet
```

### Check Wallet Balance

```bash
nilchaind q bank balances $(nilchaind keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
nilchaind tx staking create-validator \
--amount=1000000unil \
--pubkey=$(nilchaind tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$NILLION_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.025unil
```

### Edit Validator

```bash
nilchaind tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$NILLION_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.025unil
```

### Check Jailed Reason

```bash
nilchaind query slashing signing-info $(nilchaind tendermint show-validator)
```

### Unjail Validator

```bash
nilchaind tx slashing unjail --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
nilchaind tx distribution withdraw-all-rewards --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

### Withdraw Rewards with Comission

```bash
nilchaind tx distribution withdraw-rewards $(nilchaind keys show wallet --bech val -a) --commission --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

### Delegate Tokens to Your Validator

```bash
nilchaind tx staking delegate $(nilchaind keys show wallet --bech val -a) 1000000unil --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

### Redelegate Tokens to Another Validator

```bash
nilchaind tx staking redelegate $(nilchaind keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000unil --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

### Unbond Tokens from Your Validator

```bash
nilchaind tx staking unbond $(nilchaind keys show wallet --bech val -a) 1000000unil --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

### Send Tokens to Any Wallet

```bash
nilchaind tx bank send wallet <TO_WALLET_ADDRESS> 1000000unil --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
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
sudo systemctl enable nilchaind
```

### Disable Service

```bash
sudo systemctl disable nilchaind
```

### Start Service

```bash
sudo systemctl start nilchaind
```

### Stop Service

```bash
sudo systemctl stop nilchaind
```

### Restart Service

```bash
sudo systemctl restart nilchaind
```

### Check Service Status

```bash
sudo systemctl status nilchaind
```

### Check Service Logs

```bash
sudo journalctl -u nilchaind -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
nilchaind tx gov vote 1 yes --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

### List all Proposals

```bash
nilchaind query gov proposals
```

### Check Vote

```bash
nilchaind tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $NILLION_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.025unil -y
```

### Create new Proposal

```bash
nilchaind tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000unil \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.025unil \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.nillionapp/config/config.toml
```

### Get Validator Info

```bash
nilchaind status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
nilchaind q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
nilchaind status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
nilchaind status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(nilchaind tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.nillionapp/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.025unil\"/" $HOME/.nillionapp/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.nillionapp/config/config.toml
```

### Reset Chain Data

```bash
nilchaind tendermint unsafe-reset-all --home $HOME/.nillionapp --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop nilchaind && sudo systemctl disable nilchaind && sudo rm /etc/systemd/system/nilchaind.service && sudo systemctl daemon-reload && sudo rm -rf $(which nilchaind) && rm -rf $HOME/.nillionapp
```

</TabItem>

</Tabs>
