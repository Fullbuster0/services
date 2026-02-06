---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-zetachain">
# Zetachain Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `zetachain_7000-1` | Node Version: `v36.0.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export ZETA_CHAIN_ID="zetachain_7000-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
zetacored keys add wallet
```

### Recovery Wallet

```bash
zetacored keys add wallet --recover
```

### List All Wallet

```bash
zetacored keys list
```

### Delete Wallet

```bash
zetacored keys delete wallet
```

### Check Wallet Balance

```bash
zetacored q bank balances $(zetacored keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Check Pubkey

```bash
zetacored tendermint show-validator
```

### Make File validator.json

```bash
tee $HOME/.zetacored/validator.json > /dev/null << EOF
{
    "pubkey": YOUR_PUBKEY,
    "amount": "1000000000azeta",
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
zetacored tx staking create-validator $HOME/.zetacored/validator.json --from wallet --chain-id $--chain-id=$ \
 --gas-adjustment 1.5 --gas 225000 --gas-prices 20000000000azeta
```

### Edit Validator

```bash
zetacored tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$ZETA_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=20000000000azeta
```

### Check Jailed Reason

```bash
zetacored query slashing signing-info $(zetacored tendermint show-validator)
```

### Unjail Validator

```bash
zetacored tx slashing unjail --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
zetacored tx distribution withdraw-all-rewards --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

### Withdraw Rewards with Comission

```bash
zetacored tx distribution withdraw-rewards $(zetacored keys show wallet --bech val -a) --commission --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

### Delegate Tokens to Your Validator

```bash
zetacored tx staking delegate $(zetacored keys show wallet --bech val -a) 1000000000000000000azeta --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

### Redelegate Tokens to Another Validator

```bash
zetacored tx staking redelegate $(zetacored keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000000000000000azeta --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

### Unbond Tokens from Your Validator

```bash
zetacored tx staking unbond $(zetacored keys show wallet --bech val -a) 1000000000000000000azeta --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

### Send Tokens to Any Wallet

```bash
zetacored tx bank send wallet <TO_WALLET_ADDRESS> 1000000000000000000azeta --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
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
sudo systemctl enable zetacored
```

### Disable Service

```bash
sudo systemctl disable zetacored
```

### Start Service

```bash
sudo systemctl start zetacored
```

### Stop Service

```bash
sudo systemctl stop zetacored
```

### Restart Service

```bash
sudo systemctl restart zetacored
```

### Check Service Status

```bash
sudo systemctl status zetacored
```

### Check Service Logs

```bash
sudo journalctl -u zetacored -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
zetacored tx gov vote 1 yes --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

### List all Proposals

```bash
zetacored query gov proposals
```

### Check Vote

```bash
zetacored tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $ZETA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 20000000000azeta -y
```

### Create new Proposal

```bash
zetacored tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000azeta \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=20000000000azeta \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.zetacored/config/config.toml
```

### Get Validator Info

```bash
zetacored status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
zetacored q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
zetacored status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
zetacored status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(zetacored tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.zetacored/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"20000000000azeta\"/" $HOME/.zetacored/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.zetacored/config/config.toml
```

### Reset Chain Data

```bash
zetacored tendermint unsafe-reset-all --home $HOME/.zetacored --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop zetacored && sudo systemctl disable zetacored && sudo rm /etc/systemd/system/zetacored.service && sudo systemctl daemon-reload && sudo rm -rf $(which zetacored) && rm -rf $HOME/.zetacored
```

</TabItem>

</Tabs>
