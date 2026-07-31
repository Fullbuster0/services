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

<div className="h1-with-icon icon-pushchain">
# Push Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `push_42101-1` | Node Version: `v0.0.15`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export PUSH_TESTNET_CHAIN_ID="push_42101-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
pchaind keys add wallet
```

### Recovery Wallet

```bash
pchaind keys add wallet --recover
```

### List All Wallet

```bash
pchaind keys list
```

### Delete Wallet

```bash
pchaind keys delete wallet
```

### Check Wallet Balance

```bash
pchaind q bank balances $(pchaind keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Check Pubkey

```bash
pchaind tendermint show-validator
```

### Make File validator.json

```bash
tee $HOME/.pchain/validator.json > /dev/null << EOF
{
    "pubkey": YOUR_PUBKEY,
    "amount": "1000000000upc",
    "moniker": "MONIKER",
    "identity": "YOUR_KEYBASE_ID",
    "website": "YOUR_WEBSITE_URL",
    "security": "YOUR_CONTACT_MAIL",
    "details": "YOUR_DETAILS.",
    "commission-rate": "0.1",
    "commission-max-rate": "0.2",
    "commission-max-change-rate": "0.01",
    "min-self-delegation": "1"
}
EOF
```

### Create Validator

```bash
pchaind tx staking create-validator $HOME/.pchain/validator.json --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID--gas-adjustment 1.5 --gas 225000 --gas-prices 2500000000upc
```

### Edit Validator

```bash
pchaind tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$PUSH_TESTNET_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=2500000000upc
```

### Check Jailed Reason

```bash
pchaind query slashing signing-info $(pchaind tendermint show-validator)
```

### Unjail Validator

```bash
pchaind tx slashing unjail --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
pchaind tx distribution withdraw-all-rewards --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

### Withdraw Rewards with Comission

```bash
pchaind tx distribution withdraw-rewards $(pchaind keys show wallet --bech val -a) --commission --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

### Delegate Tokens to Your Validator

```bash
pchaind tx staking delegate $(pchaind keys show wallet --bech val -a) 1000000000000000000upc --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

### Redelegate Tokens to Another Validator

```bash
pchaind tx staking redelegate $(pchaind keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000000000000000upc --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

### Unbond Tokens from Your Validator

```bash
pchaind tx staking unbond $(pchaind keys show wallet --bech val -a) 1000000000000000000upc --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

### Send Tokens to Any Wallet

```bash
pchaind tx bank send wallet <TO_WALLET_ADDRESS> 1000000000000000000upc --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
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
sudo systemctl enable pchaind
```

### Disable Service

```bash
sudo systemctl disable pchaind
```

### Start Service

```bash
sudo systemctl start pchaind
```

### Stop Service

```bash
sudo systemctl stop pchaind
```

### Restart Service

```bash
sudo systemctl restart pchaind
```

### Check Service Status

```bash
sudo systemctl status pchaind
```

### Check Service Logs

```bash
sudo journalctl -u pchaind -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
pchaind tx gov vote 1 yes --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

### List all Proposals

```bash
pchaind query gov proposals
```

### Check Vote

```bash
pchaind tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $PUSH_TESTNET_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 2500000000upc -y
```

### Create new Proposal

```bash
pchaind tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000upc \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=2500000000upc \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.pchain/config/config.toml
```

### Get Validator Info

```bash
pchaind status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
pchaind q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
pchaind status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
pchaind status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(pchaind tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.pchain/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"2500000000upc\"/" $HOME/.pchain/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.pchain/config/config.toml
```

### Reset Chain Data

```bash
pchaind tendermint unsafe-reset-all --home $HOME/.pchain --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop pchaind && sudo systemctl disable pchaind && sudo rm /etc/systemd/system/pchaind.service && sudo systemctl daemon-reload && sudo rm -rf $(which pchaind) && rm -rf $HOME/.pchain
```

</TabItem>

</Tabs>
