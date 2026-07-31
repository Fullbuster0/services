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

<div className="h1-with-icon icon-soarchain">
# Soarchain Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `soarchaintestnet` | Node Version: `v0.2.9`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SOAR_CHAIN_ID="soarchaintestnet"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
soarchaind keys add wallet
```

### Recovery Wallet

```bash
soarchaind keys add wallet --recover
```

### List All Wallet

```bash
soarchaind keys list
```

### Delete Wallet

```bash
soarchaind keys delete wallet
```

### Check Wallet Balance

```bash
soarchaind q bank balances $(soarchaind keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
soarchaind tx staking create-validator \
--amount=1000000utsoar \
--pubkey=$(soarchaind tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$SOAR_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1utsoar
```

### Edit Validator

```bash
soarchaind tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$SOAR_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1utsoar
```

### Check Jailed Reason

```bash
soarchaind query slashing signing-info $(soarchaind tendermint show-validator)
```

### Unjail Validator

```bash
soarchaind tx slashing unjail --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
soarchaind tx distribution withdraw-all-rewards --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

### Withdraw Rewards with Comission

```bash
soarchaind tx distribution withdraw-rewards $(soarchaind keys show wallet --bech val -a) --commission --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

### Delegate Tokens to Your Validator

```bash
soarchaind tx staking delegate $(soarchaind keys show wallet --bech val -a) 100000utsoar --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

### Redelegate Tokens to Another Validator

```bash
soarchaind tx staking redelegate $(soarchaind keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000utsoar --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

### Unbond Tokens from Your Validator

```bash
soarchaind tx staking unbond $(soarchaind keys show wallet --bech val -a) 100000utsoar --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

### Send Tokens to Any Wallet

```bash
soarchaind tx bank send wallet <TO_WALLET_ADDRESS> 100000utsoar --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
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
sudo systemctl enable soarchaind
```

### Disable Service

```bash
sudo systemctl disable soarchaind
```

### Start Service

```bash
sudo systemctl start soarchaind
```

### Stop Service

```bash
sudo systemctl stop soarchaind
```

### Restart Service

```bash
sudo systemctl restart soarchaind
```

### Check Service Status

```bash
sudo systemctl status soarchaind
```

### Check Service Logs

```bash
sudo journalctl -u soarchaind -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
soarchaind tx gov vote 1 yes --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

### List all Proposals

```bash
soarchaind query gov proposals
```

### Check Vote

```bash
soarchaind tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $SOAR_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1utsoar -y
```

### Create new Proposal

```bash
soarchaind tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000utsoar \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1utsoar \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.soarchain/config/config.toml
```

### Get Validator Info

```bash
soarchaind status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
soarchaind q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
soarchaind status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
soarchaind status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(soarchaind tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.soarchain/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025utsoar\"/" $HOME/.soarchain/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.soarchain/config/config.toml
```

### Reset Chain Data

```bash
soarchaind tendermint unsafe-reset-all --home $HOME/.soarchain --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop soarchaind && sudo systemctl disable soarchaind && sudo rm /etc/systemd/system/soarchaind.service && sudo systemctl daemon-reload && sudo rm -rf $(which soarchaind) && rm -rf $HOME/.soarchain
```

</TabItem>

</Tabs>
