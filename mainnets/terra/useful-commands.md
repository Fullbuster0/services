---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-terra">
# Terra Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `phoenix-1` | Node Version: `v2.20.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export TERRA_CHAIN_ID="phoenix-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
terrad keys add wallet
```

### Recovery Wallet

```bash
terrad keys add wallet --recover
```

### List All Wallet

```bash
terrad keys list
```

### Delete Wallet

```bash
terrad keys delete wallet
```

### Check Wallet Balance

```bash
terrad q bank balances $(terrad keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Check Pubkey

```bash
terrad tendermint show-validator
```

### Make File validator.json

```bash
tee $HOME/.terra/validator.json > /dev/null << EOF
{
    "pubkey": YOUR_PUBKEY,
    "amount": "1000000000uluna",
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
terrad tx staking create-validator $HOME/.terra/validator.json --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas 225000 --gas-prices 0.015uluna
```

### Edit Validator

```bash
terrad tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$TERRA_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.015uluna
```

### Check Jailed Reason

```bash
terrad query slashing signing-info $(terrad tendermint show-validator)
```

### Unjail Validator

```bash
terrad tx slashing unjail --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
terrad tx distribution withdraw-all-rewards --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

### Withdraw Rewards with Comission

```bash
terrad tx distribution withdraw-rewards $(terrad keys show wallet --bech val -a) --commission --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

### Delegate Tokens to Your Validator

```bash
terrad tx staking delegate $(terrad keys show wallet --bech val -a) 1000000uluna --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

### Redelegate Tokens to Another Validator

```bash
terrad tx staking redelegate $(terrad keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000uluna --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

### Unbond Tokens from Your Validator

```bash
terrad tx staking unbond $(terrad keys show wallet --bech val -a) 1000000uluna --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

### Send Tokens to Any Wallet

```bash
terrad tx bank send wallet <TO_WALLET_ADDRESS> 1000000uluna --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
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
sudo systemctl enable terrad
```

### Disable Service

```bash
sudo systemctl disable terrad
```

### Start Service

```bash
sudo systemctl start terrad
```

### Stop Service

```bash
sudo systemctl stop terrad
```

### Restart Service

```bash
sudo systemctl restart terrad
```

### Check Service Status

```bash
sudo systemctl status terrad
```

### Check Service Logs

```bash
sudo journalctl -u terrad -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
terrad tx gov vote 1 yes --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

### List all Proposals

```bash
terrad query gov proposals
```

### Check Vote

```bash
terrad tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $TERRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.015uluna -y
```

### Create new Proposal

```bash
terrad tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uluna \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.015uluna \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.terra/config/config.toml
```

### Get Validator Info

```bash
terrad status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
terrad q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
terrad status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
terrad status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(terrad tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.terra/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.015uluna\"/" $HOME/.terra/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.terra/config/config.toml
```

### Reset Chain Data

```bash
terrad tendermint unsafe-reset-all --home $HOME/.terra --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop terrad && sudo systemctl disable terrad && sudo rm /etc/systemd/system/terrad.service && sudo systemctl daemon-reload && sudo rm -rf $(which terrad) && rm -rf $HOME/.terra
```

</TabItem>

</Tabs>
