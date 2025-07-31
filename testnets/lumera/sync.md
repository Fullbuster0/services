---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-lumera">
# Lumera Sync
</div>
<span className="sub-lines"> 
Chain ID: `lumera-testnet-2` | Node Version: `v1.7.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-lumera.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop lumerad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.lumera/data/priv_validator_state.json $HOME/.lumera/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
lumerad tendermint unsafe-reset-all --home $HOME/.lumera --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-lumera.tar.lz4 && lz4 -c -d snapshot-lumera.tar.lz4 | tar -x -C $HOME/.lumera && rm snapshot-lumera.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.lumera/priv_validator_state.json.backup $HOME/.lumera/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart lumerad && sudo journalctl -fu lumerad -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop lumerad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.lumera/data/priv_validator_state.json $HOME/.lumera/priv_validator_state.json.backup
```

### Reset the data

```bash
lumerad tendermint unsafe-reset-all --home $HOME/.lumera
```

### Add Peers

```bash
PEERS="478637fcf73477df67aa0f1a22bb915d820fb64e@lumera-testnet-rpc.shazoes.xyz:40656,5ca72982bcdccec1d14652a6e4a6319e9e3b684a@144.91.86.136:20656,f9d6abcabd2aeb417205d461ce6138473cf58619@62.169.16.57:16656,c099457bfb028f37c407f8aa77e862251ce65a22@193.34.212.38:31656,bb6f26151809349e706e6748f5fe9c6d5f8e6297@149.50.116.116:20656,a764a779e04231ed1c7a63421cfadc52832c4f1a@88.198.46.55:23556,d20502ee3ebd711cf21e6d70076357cb6d4a7c70@152.53.93.131:28656"
SNAP_RPC="https://lumera-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.lumera/config/config.toml
```

### Get Info

```bash
LATEST_HEIGHT=$(curl -s $SNAP_RPC/block | jq -r .result.block.header.height);
BLOCK_HEIGHT=$((LATEST_HEIGHT - 2000));
TRUST_HASH=$(curl -s "$SNAP_RPC/block?height=$BLOCK_HEIGHT" | jq -r .result.block_id.hash)
echo $LATEST_HEIGHT $BLOCK_HEIGHT $TRUST_HASH && sleep 2
```

### Configure the State Sync

```bash
sed -i.bak -E "s|^(enable[[:space:]]+=[[:space:]]+).*$|\1true| ;
s|^(rpc_servers[[:space:]]+=[[:space:]]+).*$|\1\"$SNAP_RPC,$SNAP_RPC\"| ;
s|^(trust_height[[:space:]]+=[[:space:]]+).*$|\1$BLOCK_HEIGHT| ;
s|^(trust_hash[[:space:]]+=[[:space:]]+).*$|\1\"$TRUST_HASH\"| ;
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.lumera/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.lumera/priv_validator_state.json.backup $HOME/.lumera/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart lumerad && sudo journalctl -fu lumerad -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.lumera/config/genesis.json https://files.shazoes.xyz/testnets/lumera/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.lumera/config/addrbook.json https://files.shazoes.xyz/testnets/lumera/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://lumera-testnet-rpc.shazoes.xyz"
  homeFolder=".lumera"
  binaryName="lumerad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
