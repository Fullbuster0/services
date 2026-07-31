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

<div className="h1-with-icon icon-cardchain">
# Cardchain Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `cardtestnet-12` | Node Version: `v0.16.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export CARD_CHAIN_ID="cardtestnet-12"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
Cardchaind keys add wallet
```

### Recovery Wallet

```bash
Cardchaind keys add wallet --recover
```

### List All Wallet

```bash
Cardchaind keys list
```

### Delete Wallet

```bash
Cardchaind keys delete wallet
```

### Check Wallet Balance

```bash
Cardchaind q bank balances $(Cardchaind keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
Cardchaind tx staking create-validator \
--amount=1000000ubpf \
--pubkey=$(Cardchaind tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$CARD_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1ubpf
```

### Edit Validator

```bash
Cardchaind tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$CARD_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1ubpf
```

### Check Jailed Reason

```bash
Cardchaind query slashing signing-info $(Cardchaind tendermint show-validator)
```

### Unjail Validator

```bash
Cardchaind tx slashing unjail --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
Cardchaind tx distribution withdraw-all-rewards --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

### Withdraw Rewards with Comission

```bash
Cardchaind tx distribution withdraw-rewards $(Cardchaind keys show wallet --bech val -a) --commission --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

### Delegate Tokens to Your Validator

```bash
Cardchaind tx staking delegate $(Cardchaind keys show wallet --bech val -a) 100000ubpf --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

### Redelegate Tokens to Another Validator

```bash
Cardchaind tx staking redelegate $(Cardchaind keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000ubpf --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

### Unbond Tokens from Your Validator

```bash
Cardchaind tx staking unbond $(Cardchaind keys show wallet --bech val -a) 100000ubpf --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

### Send Tokens to Any Wallet

```bash
Cardchaind tx bank send wallet <TO_WALLET_ADDRESS> 100000ubpf --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
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
sudo systemctl enable Cardchaind
```

### Disable Service

```bash
sudo systemctl disable Cardchaind
```

### Start Service

```bash
sudo systemctl start Cardchaind
```

### Stop Service

```bash
sudo systemctl stop Cardchaind
```

### Restart Service

```bash
sudo systemctl restart Cardchaind
```

### Check Service Status

```bash
sudo systemctl status Cardchaind
```

### Check Service Logs

```bash
sudo journalctl -u Cardchaind -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
Cardchaind tx gov vote 1 yes --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

### List all Proposals

```bash
Cardchaind query gov proposals
```

### Check Vote

```bash
Cardchaind tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $CARD_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1ubpf -y
```

### Create new Proposal

```bash
Cardchaind tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000ubpf \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1ubpf \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.cardchaind/config/config.toml
```

### Get Validator Info

```bash
Cardchaind status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
Cardchaind q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
Cardchaind status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
Cardchaind status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(Cardchaind tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.cardchaind/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025ubpf\"/" $HOME/.cardchaind/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.cardchaind/config/config.toml
```

### Reset Chain Data

```bash
Cardchaind tendermint unsafe-reset-all --home $HOME/.cardchaind --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop Cardchaind && sudo systemctl disable Cardchaind && sudo rm /etc/systemd/system/Cardchaind.service && sudo systemctl daemon-reload && sudo rm -rf $(which Cardchaind) && rm -rf $HOME/.cardchaind
```

</TabItem>

</Tabs>
