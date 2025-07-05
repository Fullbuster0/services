---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-empeiria">
# Empeiria Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `empe-testnet-2` | Node Version: `v0.2.2`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export EMPE_CHAIN_ID="empe-testnet-2"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
emped keys add wallet
```

### Recovery Wallet

```bash
emped keys add wallet --recover
```

### List All Wallet

```bash
emped keys list
```

### Delete Wallet

```bash
emped keys delete wallet
```

### Check Wallet Balance

```bash
emped q bank balances $(emped keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
emped tx staking create-validator \
--amount=1000000uempe \
--pubkey=$(emped tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$EMPE_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uempe
```

### Edit Validator

```bash
emped tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$EMPE_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uempe
```

### Check Jailed Reason

```bash
emped query slashing signing-info $(emped tendermint show-validator)
```

### Unjail Validator

```bash
emped tx slashing unjail --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
emped tx distribution withdraw-all-rewards --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

### Withdraw Rewards with Comission

```bash
emped tx distribution withdraw-rewards $(emped keys show wallet --bech val -a) --commission --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

### Delegate Tokens to Your Validator

```bash
emped tx staking delegate $(emped keys show wallet --bech val -a) 100000uempe --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

### Redelegate Tokens to Another Validator

```bash
emped tx staking redelegate $(emped keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000uempe --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

### Unbond Tokens from Your Validator

```bash
emped tx staking unbond $(emped keys show wallet --bech val -a) 100000uempe --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

### Send Tokens to Any Wallet

```bash
emped tx bank send wallet <TO_WALLET_ADDRESS> 100000uempe --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
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
sudo systemctl enable emped
```

### Disable Service

```bash
sudo systemctl disable emped
```

### Start Service

```bash
sudo systemctl start emped
```

### Stop Service

```bash
sudo systemctl stop emped
```

### Restart Service

```bash
sudo systemctl restart emped
```

### Check Service Status

```bash
sudo systemctl status emped
```

### Check Service Logs

```bash
sudo journalctl -u emped -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
emped tx gov vote 1 yes --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

### List all Proposals

```bash
emped query gov proposals
```

### Check Vote

```bash
emped tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $EMPE_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uempe -y
```

### Create new Proposal

```bash
emped tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uempe \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1uempe \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.empe-chain/config/config.toml
```

### Get Validator Info

```bash
emped status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
emped q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
emped status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
emped status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(emped tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.empe-chain/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025uempe\"/" $HOME/.empe-chain/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.empe-chain/config/config.toml
```

### Reset Chain Data

```bash
emped tendermint unsafe-reset-all --home $HOME/.empe-chain --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop emped && sudo systemctl disable emped && sudo rm /etc/systemd/system/emped.service && sudo systemctl daemon-reload && sudo rm -rf $(which emped) && rm -rf $HOME/.empe-chain
```

</TabItem>

</Tabs>
