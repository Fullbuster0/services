---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-tellor">
# Tellor Sync
</div>
<span className="sub-lines"> 
Chain ID: `tellor-1` | Node Version: `v5.1.1`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-tellor.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop layerd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.layer/data/priv_validator_state.json $HOME/.layer/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
layerd tendermint unsafe-reset-all --home $HOME/.layer --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-tellor.tar.lz4 && lz4 -c -d snapshot-tellor.tar.lz4 | tar -x -C $HOME/.layer && rm snapshot-tellor.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.layer/priv_validator_state.json.backup $HOME/.layer/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart layerd && sudo journalctl -fu layerd -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop layerd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.layer/data/priv_validator_state.json $HOME/.layer/priv_validator_state.json.backup
```

### Reset the data

```bash
layerd tendermint unsafe-reset-all --home $HOME/.layer
```

### Add Peers

```bash
PEERS="afcf9c90dc741a3eb55a1c4a34cc17744d65f522@tellor-mainnet-rpc.shazoes.xyz:30556,82a5994bb9b2af5fcbf103df674412777d39326f@135.181.5.232:30856,78d08d7dc0a7a0fdb034e1bc892b07c263c6e052@176.9.113.61:60656,2b8af463a1f0e84aec6e4dbf3126edf3225df85e@13.52.231.70:26656,9358c72aa8be31ce151ef591e6ecf08d25812993@18.143.181.83:26656,f2644778a8a2ca3b55ec65f1b7799d32d4a7098e@54.149.160.93:26656,95e55a6cfb850db8c23e969ddd461eac28b98702@3.91.103.4:26656"
SNAP_RPC="https://tellor-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.layer/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.layer/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.layer/priv_validator_state.json.backup $HOME/.layer/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart layerd && sudo journalctl -fu layerd -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.layer/config/genesis.json https://files.shazoes.xyz/mainnets/tellor/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.layer/config/addrbook.json https://files.shazoes.xyz/mainnets/tellor/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://tellor-mainnet-rpc.shazoes.xyz"
  homeFolder=".layer"
  binaryName="layerd"
  maxPeers={25}
/>
</TabItem>
</Tabs>
