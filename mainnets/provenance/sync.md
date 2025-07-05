---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-provenance">
# Provenance Sync
</div>
<span className="sub-lines"> 
Chain ID: `pio-mainnet-1` | Node Version: `v1.24.0`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-provenance.json"
/>

### Install dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop provenanced
```

### Backup priv_validator_state.json

```bash
cp $HOME/.provenanced/data/priv_validator_state.json $HOME/.provenanced/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
provenanced tendermint unsafe-reset-all --home $HOME/.provenanced --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-provenance.tar.lz4 && lz4 -c -d snapshot-provenance.tar.lz4 | tar -x -C $HOME/.provenanced && rm snapshot-provenance.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.provenanced/priv_validator_state.json.backup $HOME/.provenanced/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart provenanced && sudo journalctl -fu provenanced -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop provenanced
```

### Backup priv_validator_state.json

```bash
cp $HOME/.provenanced/data/priv_validator_state.json $HOME/.provenanced/priv_validator_state.json.backup
```

### Reset the data

```bash
provenanced tendermint unsafe-reset-all --home $HOME/.provenanced
```

### Add Peers

```bash
PEERS="57197d502a99ae640273bfe7d388fdb09ff33cf6@65.109.23.55:20106,f8c8a2baa9508ff503c3cac9a0d36146b9d65d55@34.148.91.199:26656,0b154462c3969dcd509f33bc283716cfd23c6844@37.187.149.80:26676,d726eaf88fd36881b11fe857ba9ded02802c1521@143.198.57.205:26656,1d634eb65723ecd18d101e8041990c7cd5fa2a19@37.17.244.207:57656,026e5ea19bc6aa5c67fe62f5f30f417929433b93@207.121.13.108:56656,51494b1f7123cadbc56a7b6c1225f26ff25ce81c@135.181.208.245:56656,768cef4673e00f92e9dde27ad0cc7374e3330b51@168.119.139.86:36696"
SNAP_RPC="https://provenance-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.provenanced/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.provenanced/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.provenanced/priv_validator_state.json.backup $HOME/.provenanced/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart provenanced && sudo journalctl -fu provenanced -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.provenanced/config/genesis.json https://files.shazoes.xyz/mainnets/provenance/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.provenanced/config/addrbook.json https://files.shazoes.xyz/mainnets/provenance/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://provenance-mainnet-rpc.shazoes.xyz"
  homeFolder=".provenanced"
  binaryName="provenanced"
  maxPeers={25}
/>
</TabItem>
</Tabs>
