---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="h1-with-icon icon-cosmoshub">
# CosmosHub Useful Commands
</div>
<span className="sub-lines"> 
 Chain ID: `cosmoshub-4` | Node Version: `v25.1.0`
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
--identity=YOUR_KEYBASE_ID \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$COSMOSHUB_CHAIN_ID \
--commission-rate=0.05 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1 \
--from=wallet \
--gas-adjustment=1.5 \
--gas=auto \
--gas-prices=0.005uatom \
-y
```

### Edit Validator

```bash
gaiad tx staking edit-validator \
--new-moniker=$MONIKER \
--identity=YOUR_KEYBASE_ID \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$COSMOSHUB_CHAIN_ID \
--commission-rate=0.05 \
--from=wallet \
--gas-adjustment=1.5 \
--gas=auto \
--gas-prices=0.005uatom \
-y
```

### Unjail Validator

```bash
gaiad tx slashing unjail --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

### Validator Info

```bash
gaiad q staking validator $(gaiad keys show wallet --bech val -a)
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

### List Proposals

```bash
gaiad q gov proposals
```

### Vote

```bash
gaiad tx gov vote 1 yes --from wallet --chain-id $COSMOSHUB_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.005uatom -y
```

</TabItem>
<TabItem value="status" label="Status">

## Node Status

```bash
gaiad status 2>&1 | jq
```

### Check Sync

```bash
gaiad status 2>&1 | jq .SyncInfo
```

### Peer Count

```bash
curl -s localhost:${COSMOSHUB_PORT:-14}657/net_info | jq '.result.n_peers'
```

</TabItem>
</Tabs>
