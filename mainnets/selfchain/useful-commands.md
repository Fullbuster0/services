---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-selfchain">
# Selfchain Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `self-1` | Node Version: `v1.0.1`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SELFCHAIN_CHAIN_ID="self-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
selfchaind keys add wallet
```

### Recovery Wallet

```bash
selfchaind keys add wallet --recover
```

### List All Wallet

```bash
selfchaind keys list
```

### Delete Wallet

```bash
selfchaind keys delete wallet
```

### Check Wallet Balance

```bash
selfchaind q bank balances $(selfchaind keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
selfchaind tx staking create-validator \
--amount=1000000uslf \
--pubkey=$(selfchaind tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$SELFCHAIN_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uslf
```

### Edit Validator

```bash
selfchaind tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$SELFCHAIN_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uslf
```

### Check Jailed Reason

```bash
selfchaind query slashing signing-info $(selfchaind tendermint show-validator)
```

### Unjail Validator

```bash
selfchaind tx slashing unjail --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
selfchaind tx distribution withdraw-all-rewards --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

### Withdraw Rewards with Comission

```bash
selfchaind tx distribution withdraw-rewards $(selfchaind keys show wallet --bech val -a) --commission --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

### Delegate Tokens to Your Validator

```bash
selfchaind tx staking delegate $(selfchaind keys show wallet --bech val -a) 100000uslf --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

### Redelegate Tokens to Another Validator

```bash
selfchaind tx staking redelegate $(selfchaind keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000uslf --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

### Unbond Tokens from Your Validator

```bash
selfchaind tx staking unbond $(selfchaind keys show wallet --bech val -a) 100000uslf --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

### Send Tokens to Any Wallet

```bash
selfchaind tx bank send wallet <TO_WALLET_ADDRESS> 100000uslf --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
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
sudo systemctl enable selfchaind
```

### Disable Service

```bash
sudo systemctl disable selfchaind
```

### Start Service

```bash
sudo systemctl start selfchaind
```

### Stop Service

```bash
sudo systemctl stop selfchaind
```

### Restart Service

```bash
sudo systemctl restart selfchaind
```

### Check Service Status

```bash
sudo systemctl status selfchaind
```

### Check Service Logs

```bash
sudo journalctl -u selfchaind -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
selfchaind tx gov vote 1 yes --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

### List all Proposals

```bash
selfchaind query gov proposals
```

### Check Vote

```bash
selfchaind tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $SELFCHAIN_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uslf -y
```

### Create new Proposal

```bash
selfchaind tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uslf \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1uslf \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.selfchain/config/config.toml
```

### Get Validator Info

```bash
selfchaind status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
selfchaind q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
selfchaind status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
selfchaind status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(selfchaind tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.selfchain/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025uslf\"/" $HOME/.selfchain/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.selfchain/config/config.toml
```

### Reset Chain Data

```bash
selfchaind tendermint unsafe-reset-all --home $HOME/.selfchain --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop selfchaind && sudo systemctl disable selfchaind && sudo rm /etc/systemd/system/selfchaind.service && sudo systemctl daemon-reload && sudo rm -rf $(which selfchaind) && rm -rf $HOME/.selfchain
```

</TabItem>

</Tabs>
