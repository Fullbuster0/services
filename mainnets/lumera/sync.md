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
# Lumera Protocol Sync
</div>
<span className="sub-lines"> 
Chain ID: `lumera-mainnet-1` | Node Version: `v1.5.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-lumera.json"
/>

### Install dependencies

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
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-lumera.tar.lz4 && lz4 -c -d snapshot-lumera.tar.lz4 | tar -x -C $HOME/.lumera && rm snapshot-lumera.tar.lz4
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
PEERS="277773c00a7f7029775deba6e28532c40b670d16@95.214.55.46:30357,c8e9ab5451951bc8f75cdc0eb81b9cb25571e7df@161.35.221.191:26656,ddd091cecab267b467f9f6167e9268391fc0ec1f@57.128.98.34:20001,,faf9bc564f4d200d741da088731b6b3ba02192aa@65.108.232.93:30756,89757803f40da51678451735445ad40d5b15e059@169.155.45.78:26656,1ef18bb3ed8efee9fb150151cbcdfca438fa9db4@64.185.227.242:30756,ab5b0bafe670543d6f25dea19a264c7da1e50672@65.108.201.240:30756,5b8d4baa4e4c86b94322d452dc66c4bf218cfc95@184.107.244.74:12300,54361f222e87b7dd1cb90973079c44e7e31c03e5@15.235.42.134:12300,2afe400bfe662b915111ec6c1e5fcb0d2c0ba64e@37.27.239.10:26656"
SNAP_RPC="https://lumera-mainnet-rpc.shazoes.xyz:443"
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
wget -O $HOME/.lumera/config/genesis.json https://files.shazoes.xyz/mainnets/lumera/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.lumera/config/addrbook.json https://files.shazoes.xyz/mainnets/lumera/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://lumera-mainnet-rpc.shazoes.xyz"
  homeFolder=".lumera"
  binaryName="lumerad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
