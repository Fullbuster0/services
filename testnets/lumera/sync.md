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
Chain ID: `lumera-testnet-2` | Node Version: `v1.6.0`
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
PEERS="1ee7b29ce2ef3c7d18a58dc96ab9e6516755bfa0f@65.108.131.104:30756,8d7557e2e4e8c5d3b409663764d9fdc22d2c3449@44.204.100.172:26656,4ee99f2039eee00535e2197f77cfd23f61803cc0@66.129.102.28:26656,7afeb06db4edc7e7a6c018909876808408c4d1d7@148.113.165.128:56416,7c37a7eb1292b432a8f98ba40d32cb3dd4b3beeb@164.132.247.253:56416,3e00e110111612ac9c3d93b6ba75796c82a7bd1d@141.94.141.165:26856,7f0c7ae8eae8108cc8ed6dbc66efd16f9676bac9@3.218.250.158:26656,54bb17ce612313b941ec6aee00413d6a08032e69@64.203.83.66:26656,5e8af106ab8273479eaf76c81ceef6fcd0a42555@152.53.110.139:63656,c03fce64f173d50a6b98309658d43bb3fa09ae17@65.109.120.211:36656"
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
