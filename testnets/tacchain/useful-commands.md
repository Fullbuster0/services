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

<div className="h1-with-icon icon-tacchain">
# Tacchain Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `tacchain_2391-1` | Node Version: `v0.0.11`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export TAC_CHAIN_ID="tacchain_2391-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
tacchaind keys add wallet
```

### Recovery Wallet

```bash
tacchaind keys add wallet --recover
```

### List All Wallet

```bash
tacchaind keys list
```

### Delete Wallet

```bash
tacchaind keys delete wallet
```

### Check Wallet Balance

```bash
tacchaind q bank balances $(tacchaind keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
tacchaind tx staking create-validator \
--amount=1000000000000000000utac \
--pubkey=$(tacchaind tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$TAC_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=100000000000utac
```

### Edit Validator

```bash
tacchaind tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$TAC_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=100000000000utac
```

### Check Jailed Reason

```bash
tacchaind query slashing signing-info $(tacchaind tendermint show-validator)
```

### Unjail Validator

```bash
tacchaind tx slashing unjail --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
tacchaind tx distribution withdraw-all-rewards --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

### Withdraw Rewards with Comission

```bash
tacchaind tx distribution withdraw-rewards $(tacchaind keys show wallet --bech val -a) --commission --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

### Delegate Tokens to Your Validator

```bash
tacchaind tx staking delegate $(tacchaind keys show wallet --bech val -a) 1000000000000000000utac --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

### Redelegate Tokens to Another Validator

```bash
tacchaind tx staking redelegate $(tacchaind keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000000000000000utac --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

### Unbond Tokens from Your Validator

```bash
tacchaind tx staking unbond $(tacchaind keys show wallet --bech val -a) 1000000000000000000utac --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

### Send Tokens to Any Wallet

```bash
tacchaind tx bank send wallet <TO_WALLET_ADDRESS> 1000000000000000000utac --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
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
sudo systemctl enable tacchaind
```

### Disable Service

```bash
sudo systemctl disable tacchaind
```

### Start Service

```bash
sudo systemctl start tacchaind
```

### Stop Service

```bash
sudo systemctl stop tacchaind
```

### Restart Service

```bash
sudo systemctl restart tacchaind
```

### Check Service Status

```bash
sudo systemctl status tacchaind
```

### Check Service Logs

```bash
sudo journalctl -u tacchaind -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
tacchaind tx gov vote 1 yes --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

### List all Proposals

```bash
tacchaind query gov proposals
```

### Check Vote

```bash
tacchaind tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $TAC_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 100000000000utac -y
```

### Create new Proposal

```bash
tacchaind tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000ulume \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=100000000000utac \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.tacchaind/config/config.toml
```

### Get Validator Info

```bash
tacchaind status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
tacchaind q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
tacchaind status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
tacchaind status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(tacchaind tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.tacchaind/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"100000000000utac\"/" $HOME/.tacchaind/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.tacchaind/config/config.toml
```

### Reset Chain Data

```bash
tacchaind tendermint unsafe-reset-all --home $HOME/.tacchaind --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop tacchaind && sudo systemctl disable tacchaind && sudo rm /etc/systemd/system/tacchaind.service && sudo systemctl daemon-reload && sudo rm -rf $(which tacchaind) && rm -rf $HOME/.tacchaind
```

</TabItem>

</Tabs>
