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

### Install Dependencies

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
PEERS="950df6e6e1a89b6911c9477841e899df177909ac@provenance-mainnet-rpc.shazoes.xyz:13656,a72ff39dc56aa631a75f40a3b66b59602c330a91@57.129.2.102:26656,93b2dbf54d15b838c6248e9973e2c8ee6594aed0@104.196.147.17:26656,609abe51851eb5cd58721ffa7d4aa492d92305c3@34.148.50.57:26656,f56b4ef21f6d59c86d54df8616223ddac64a5215@35.229.62.62:26656,13250735ef27abf0baedab0d2c8d326da6a3d755@34.139.230.6:26656,5fe111a2972c807a51a6d80ce1de10506407b26c@34.74.211.28:26656,1778f930bfb86487b4a6f49d26ef770f4127aaed@provenance.rpc.m.anode.team:29656,8d01c48c99a5427d40912d900f14650c83d0bedd@65.108.120.161:40656,1778f930bfb86487b4a6f49d26ef770f4127aaed@65.21.224.150:29656,026e5ea19bc6aa5c67fe62f5f30f417929433b93@207.121.13.108:56656,014e0a38657e9b5fa7abbac3f597c2bd0381a55a@provenance-mainnet-rpc.itrocket.net:57656,014e0a38657e9b5fa7abbac3f597c2bd0381a55a@65.109.30.26:57656,885214c1af1aecaa58b0513e98cc7a9a377f140d@45.140.42.43:26656,30973174fa34714da38bda961bea24a49f84b15c@provenance-rpc.highstakes.ch:26657"SNAP_RPC="https://provenance-mainnet-rpc.shazoes.xyz:443"
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
