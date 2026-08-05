---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-lava">
# Lava Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `cosmoshub-4` | Node Version: `v25.3.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export COSMOSHUB_CHAIN_ID="cosmoshub-4"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
gaiad keys add wallet
```

### Recovery Wallet

```bash
gaiad keys add wallet --recover
```

### List All Wallet

```bash
gaiad keys list
```

### Delete Wallet

```bash
gaiad keys delete wallet
```

### Check Wallet Balance

```bash
gaiad q bank balances $(gaiad keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
gaiad tx staking create-validator \
--amount=1000000uatom \
--pubkey=$(gaiad tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$COSMOSHUB_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.005uatom
```

### Edit Validator

```bash
gaiad tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$COSMOSHUB_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.005uatom
```

### Check Jailed Reason

```bash
gaiad query slashing signing-info $(gaiad tendermint show-validator)
```

### Unjail Validator

```bash
gaiad tx slashing unjail --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
gaiad tx distribution withdraw-all-rewards --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### Withdraw Rewards with Comission

```bash
gaiad tx distribution withdraw-rewards $(gaiad keys show wallet --bech val -a) --commission --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### Delegate Tokens to Your Validator

```bash
gaiad tx staking delegate $(gaiad keys show wallet --bech val -a) 1000000uatom --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### Redelegate Tokens to Another Validator

```bash
gaiad tx staking redelegate $(gaiad keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000uatom --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### Unbond Tokens from Your Validator

```bash
gaiad tx staking unbond $(gaiad keys show wallet --bech val -a) 1000000uatom --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### Send Tokens to Any Wallet

```bash
gaiad tx bank send wallet <TO_WALLET_ADDRESS> 1000000uatom --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
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
sudo systemctl enable gaiad
```

### Disable Service

```bash
sudo systemctl disable gaiad
```

### Start Service

```bash
sudo systemctl start gaiad
```

### Stop Service

```bash
sudo systemctl stop gaiad
```

### Restart Service

```bash
sudo systemctl restart gaiad
```

### Check Service Status

```bash
sudo systemctl status gaiad
```

### Check Service Logs

```bash
sudo journalctl -u gaiad -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
gaiad tx gov vote 1 yes --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### List all Proposals

```bash
gaiad query gov proposals
```

### Check Vote

```bash
gaiad tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### Create new Proposal

```bash
gaiad tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uatom \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.005uatom \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.gaia/config/config.toml
```

### Get Validator Info

```bash
gaiad status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
gaiad q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
gaiad status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
gaiad status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(gaiad tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.gaia/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.005uatom\"/" $HOME/.gaia/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.gaia/config/config.toml
```

### Reset Chain Data

```bash
gaiad tendermint unsafe-reset-all --home $HOME/.gaia --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop gaiad && sudo systemctl disable gaiad && sudo rm /etc/systemd/system/gaiad.service && sudo systemctl daemon-reload && sudo rm -rf $(which gaiad) && rm -rf $HOME/.gaia
```

</TabItem>

</Tabs>
