---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="archived-notice-banner">
  <span className="badge-archive">ARCHIVE</span>
  <span className="notice-text">Network no longer actively validated · Services docs only (no updated)</span>
</div>

<div className="h1-with-icon icon-airchain">
# Airchain Sync
</div>
<span className="sub-lines"> 
Chain ID: `varanasi-1` | Node Version: `v0.3.2`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-airchain.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop junctiond
```

### Backup priv_validator_state.json

```bash
cp $HOME/.junctiond/data/priv_validator_state.json $HOME/.junctiond/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
junctiond tendermint unsafe-reset-all --home $HOME/.junctiond --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-airchain.tar.lz4 && lz4 -c -d snapshot-airchain.tar.lz4 | tar -x -C $HOME/.junctiond && rm snapshot-airchain.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.junctiond/priv_validator_state.json.backup $HOME/.junctiond/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart junctiond && sudo journalctl -fu junctiond -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop junctiond
```

### Backup priv_validator_state.json

```bash
cp $HOME/.junctiond/data/priv_validator_state.json $HOME/.junctiond/priv_validator_state.json.backup
```

### Reset the data

```bash
junctiond tendermint unsafe-reset-all --home $HOME/.junctiond
```

### Add Peers

```bash
PEERS="23d311c322a87930c58714cb32dab19f9669c7b5@airchain-testnet-rpc.shazoes.xyz:20656,03c296401c5177ed06258d3bba0649131ef02fed@65.108.233.73:19656,b82f3cb589b730da922484a2a2c44b252bd3d5db@152.53.121.42:41656,910cc6790cc6f97f5e1f9f049e81917bceba4870@144.76.70.103:19656,301a14ccbcf3fc15f9f90619e39743a8bf9eeafd@65.109.93.124:30856,cfb052e64e508f4b40f0ec07b52a31abfda82270@95.217.62.179:11956,f84b41b95e828ee915aea19dd656cca7d39cf47b@37.17.244.207:33656,b43f7c96bb780d9ac535d3c1f78092cf8c455e85@104.36.23.246:26656,ca0a4b67fd6ffd6a70ea8d0e3c8d284de0f8222f@37.27.132.57:19656,1d7a1809b616ce2437a5978bebbfcefec4bc3aa0@193.34.212.80:60656"
SNAP_RPC="https://airchain-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.junctiond/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.junctiond/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.junctiond/priv_validator_state.json.backup $HOME/.junctiond/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart junctiond && sudo journalctl -fu junctiond -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.junctiond/config/genesis.json https://files.shazoes.xyz/testnets/airchain/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.junctiond/config/addrbook.json https://files.shazoes.xyz/testnets/airchain/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://airchain-testnet-rpc.shazoes.xyz"
  homeFolder=".junctiond"
  binaryName="junctiond"
  maxPeers={25}
/>
</TabItem>
</Tabs>
