---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-gnoland">
# Gnolan Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `test9.0` | Node Version: `chain/test9.0`
</span>

:::note
You Need Set This Variabels!!!, for address you can generate first
:::

```js
RPC="https://gnoland-testnet-rpc.shazoes.xyz"
MONIKER="Your_Moniker"
ADDRESS="Your_Address_Wallet"
VALOPER=$(gnoland secrets get validator_key | jq -r '.address')
PUBKEY=$(gnoland secrets get validator_key | jq -r '.pub_key')
echo "export RPC=\"$RPC\"" >> $HOME/.bash_profile
echo "export MONIKER=\"$MONIKER\"" >> $HOME/.bash_profile
echo "export ADDRESS=\"$ADDRESS\"" >> $HOME/.bash_profile
echo "export VALOPER=\"$VALOPER\"" >> $HOME/.bash_profile
echo "export PUBKEY=\"$PUBKEY\"" >> $HOME/.bash_profile
echo "export GNOLAND_CHAIN_ID="test9"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
gnokey add wallet
```

### Recovery Wallet

```bash
gnokey add wallet --recover
```

### List All Wallet

```bash
gnokey list
```

### Delete Wallet

```bash
gnokey delete wallet
```

### Check Wallet Balance

```bash
gnokey query -remote $RPC auth/accounts/$ADDRESS
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have set Variabels

:::

### Register

```bash
DESCRIPTION="Your_Description"
ACCOUNT_INFO=$(gnokey query -remote $RPC auth/accounts/$ADDRESS)
ACCOUNT_JSON=$(echo "$ACCOUNT_INFO" | sed -n '/^data:/,$p' | sed 's/^data: //')
ACCOUNT_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.account_number')
SEQUENCE_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.sequence')
```

```bash
gnokey maketx call -pkgpath "gno.land/r/gnops/valopers" -func "Register" -args $MONIKER -args $DESCRIPTION -args $VALOPER -args $PUBKEY -gas-fee 1000000ugnot -gas-wanted 15000000 -send "" $ADDRESS > call.tx
```

```bash
gnokey sign -tx-path call.tx -chainid $GNOLAND_CHAIN_ID -account-number $ACCOUNT_NUMBER -account-sequence $SEQUENCE_NUMBER $ADDRESS
```

```bash
gnokey broadcast -remote $RPC call.tx
```

### Update Moniker

```bash
NEWMONIKER="Your_New_Moniker"
ACCOUNT_INFO=$(gnokey query -remote $RPC auth/accounts/$ADDRESS)
ACCOUNT_JSON=$(echo "$ACCOUNT_INFO" | sed -n '/^data:/,$p' | sed 's/^data: //')
ACCOUNT_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.account_number')
SEQUENCE_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.sequence')
```

```bash
gnokey maketx call -pkgpath "gno.land/r/gnops/valopers" -func "UpdateMoniker"  -args $VALOPER -args $NEWMONIKER -gas-fee 1000000ugnot -gas-wanted 15000000 -send "" $ADDRESS > call.tx
```

```bash
gnokey sign -tx-path call.tx -chainid $GNOLAND_CHAIN_ID -account-number $ACCOUNT_NUMBER -account-sequence $SEQUENCE_NUMBER $ADDRESS
```

```bash
gnokey broadcast -remote $RPC call.tx
```

### Update Description

```bash
NEWDESCRIPTION="Your_Description"
ACCOUNT_INFO=$(gnokey query -remote $RPC auth/accounts/$ADDRESS)
ACCOUNT_JSON=$(echo "$ACCOUNT_INFO" | sed -n '/^data:/,$p' | sed 's/^data: //')
ACCOUNT_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.account_number')
SEQUENCE_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.sequence')
```

```bash
gnokey maketx call -pkgpath "gno.land/r/gnops/valopers" -func "UpdateDescription"  -args $VALOPER -args $NEWDESCRIPTION -gas-fee 1000000ugnot -gas-wanted 15000000 -send "" $ADDRESS > call.tx
```

```bash
gnokey sign -tx-path call.tx -chainid $GNOLAND_CHAIN_ID -account-number $ACCOUNT_NUMBER -account-sequence $SEQUENCE_NUMBER $ADDRESS
```

```bash
gnokey broadcast -remote $RPC call.tx
```

### Update Keep Running

<span>
Set false / true
</span>

```bash
BOOLEAN="false"
ACCOUNT_INFO=$(gnokey query -remote $RPC auth/accounts/$ADDRESS)
ACCOUNT_JSON=$(echo "$ACCOUNT_INFO" | sed -n '/^data:/,$p' | sed 's/^data: //')
ACCOUNT_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.account_number')
SEQUENCE_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.sequence')
```

```bash
gnokey maketx call -pkgpath "gno.land/r/gnops/valopers" -func "UpdateKeepRunning"  -args $VALOPER -args $BOOLEAN -gas-fee 1000000ugnot -gas-wanted 15000000 -send "" $ADDRESS > call.tx
```

```bash
gnokey sign -tx-path call.tx -chainid $GNOLAND_CHAIN_ID -account-number $ACCOUNT_NUMBER -account-sequence $SEQUENCE_NUMBER $ADDRESS
```

```bash
gnokey broadcast -remote $RPC call.tx
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
sudo systemctl enable gnoland
```

### Disable Service

```bash
sudo systemctl disable gnoland
```

### Start Service

```bash
sudo systemctl start gnoland
```

### Stop Service

```bash
sudo systemctl stop gnoland
```

### Restart Service

```bash
sudo systemctl restart gnoland
```

### Check Service Status

```bash
sudo systemctl status gnoland
```

### Check Service Logs

```bash
sudo journalctl -u gnoland -f --no-hostname -o cat
```

</TabItem>

<TabItem value="Utility" label="Utility">

## Utility

:::note

Change 42657 to your port rpc

:::

### Get Validator Key

```bash
gnoland secrets get validator_key
```

### Get Validator Info

```bash
curl -s http://127.0.0.1:42657/status | jq '.result.validator_info'
```

### Get Sync Status

```bash
curl -s http://127.0.0.1:42657/status | jq '.result.sync_info.catching_up'
```

### Get Latest Height

```bash
curl -s http://127.0.0.1:42657/status | jq '.result.sync_info.latest_block_height'
```

### Get Node Peer

```bash
SERVER_IP=$(curl -4 -s ifconfig.me)
gnoland secrets get node_id.p2p_address | sed "s/0\.0\.0\.0/$SERVER_IP/"
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop gnoland && sudo systemctl disable gnoland && sudo rm /etc/systemd/system/gnoland.service && sudo systemctl daemon-reload && sudo rm -rf $(which gnoland) && sudo rm -rf $(which gnogenesis) && sudo rm -rf $(which gnokey) && rm -rf $HOME/gnoland-data && rm -rf $HOME/gno
```

</TabItem>

</Tabs>
