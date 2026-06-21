---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `hippo-protocol-1` | Node Version: `v1.0.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export HIPPO_CHAIN_ID="hippo-protocol-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
hippod keys add wallet
```

### Recovery Wallet

```bash
hippod keys add wallet --recover
```

### List All Wallet

```bash
hippod keys list
```

### Delete Wallet

```bash
hippod keys delete wallet
```

### Check Wallet Balance

```bash
hippod q bank balances $(hippod keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Check Pubkey

```bash
hippod tendermint show-validator
```

### Make File validator.json

```bash
tee $HOME/.hippo/validator.json > /dev/null << EOF
{
    "pubkey": YOUR_PUBKEY,
    "amount": "1000000000ahp",
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
hippod tx staking create-validator $HOME/.hippo/validator.json --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas 225000 --gas-prices 4000000000000ahp
```

### Edit Validator

```bash
hippod tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$HIPPO_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=4000000000000ahp
```

### Check Jailed Reason

```bash
hippod query slashing signing-info $(hippod tendermint show-validator)
```

### Unjail Validator

```bash
hippod tx slashing unjail --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
hippod tx distribution withdraw-all-rewards --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

### Withdraw Rewards with Comission

```bash
hippod tx distribution withdraw-rewards $(hippod keys show wallet --bech val -a) --commission --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

### Delegate Tokens to Your Validator

```bash
hippod tx staking delegate $(hippod keys show wallet --bech val -a) 1000000000000000000ahp --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

### Redelegate Tokens to Another Validator

```bash
hippod tx staking redelegate $(hippod keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000000000000000ahp --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

### Unbond Tokens from Your Validator

```bash
hippod tx staking unbond $(hippod keys show wallet --bech val -a) 1000000000000000000ahp --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

### Send Tokens to Any Wallet

```bash
hippod tx bank send wallet <TO_WALLET_ADDRESS> 1000000000000000000ahp --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
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
sudo systemctl enable hippod
```

### Disable Service

```bash
sudo systemctl disable hippod
```

### Start Service

```bash
sudo systemctl start hippod
```

### Stop Service

```bash
sudo systemctl stop hippod
```

### Restart Service

```bash
sudo systemctl restart hippod
```

### Check Service Status

```bash
sudo systemctl status hippod
```

### Check Service Logs

```bash
sudo journalctl -u hippod -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
hippod tx gov vote 1 yes --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

### List all Proposals

```bash
hippod query gov proposals
```

### Check Vote

```bash
hippod tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $HIPPO_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 4000000000000ahp -y
```

### Create new Proposal

```bash
hippod tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uaxone \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=4000000000000ahp \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.hippo/config/config.toml
```

### Get Validator Info

```bash
hippod status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
hippod q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
hippod status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
hippod status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(hippod tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.hippo/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"4000000000000ahp\"/" $HOME/.hippo/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.hippo/config/config.toml
```

### Reset Chain Data

```bash
hippod tendermint unsafe-reset-all --home $HOME/.hippo --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop hippod && sudo systemctl disable hippod && sudo rm /etc/systemd/system/hippod.service && sudo systemctl daemon-reload && sudo rm -rf $(which hippod) && rm -rf $HOME/.hippo
```

</TabItem>

</Tabs>
