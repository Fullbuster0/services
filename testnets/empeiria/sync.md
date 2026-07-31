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
  <span className="notice-text">Network no longer actively validated · Services docs only</span>
</div>

<div className="h1-with-icon icon-empeiria">
# Empeiria Sync
</div>
<span className="sub-lines"> 
Chain ID: `empe-testnet-2` | Node Version: `v0.2.2`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop emped
```

### Backup priv_validator_state.json

```bash
cp $HOME/.empe-chain/data/priv_validator_state.json $HOME/.empe-chain/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
emped tendermint unsafe-reset-all --home $HOME/.empe-chain --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-empeiria.tar.lz4 && lz4 -c -d snapshot-empeiria.tar.lz4 | tar -x -C $HOME/.empe-chain && rm snapshot-empeiria.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.empe-chain/priv_validator_state.json.backup $HOME/.empe-chain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart emped && sudo journalctl -fu emped -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop emped
```

### Backup priv_validator_state.json

```bash
cp $HOME/.empe-chain/data/priv_validator_state.json $HOME/.empe-chain/priv_validator_state.json.backup
```

### Reset the data

```bash
emped tendermint unsafe-reset-all --home $HOME/.empe-chain
```

### Add Peers

```bash
PEERS="03aa072f917ed1b79a14ea2cc660bc3bac787e82@empeiria-testnet-peer.itrocket.net:28656,106b4f4e333bd04d2b93768dace23bae12ebc1b7@65.109.112.148:21156,a9cf0ffdef421d1f4f4a3e1573800f4ee6529773@136.243.13.36:29056,e058f20874c7ddf7d8dc8a6200ff6c7ee66098ba@65.109.93.124:29056,af1bae5ad434fc2188a1ef9bed23398492826896@193.34.212.80:11156,39e8aee22825a7fdf65a664282843ee13849b6f2@162.244.24.82:27656,2db322b41d26559476f929fda51bce06c3db8ba4@65.109.24.155:11256,38ca15d129e9f02ff4164649f1e8ba1325237e7f@194.163.145.153:26656,fec4ba35a0c58c29a101d728a5008370ac6fe7ed@116.202.150.231:28656,78f766310a83b6670023169b93f01d140566db79@65.109.83.40:29056"
SNAP_RPC="https://empeiria-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.empe-chain/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.empe-chain/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.empe-chain/priv_validator_state.json.backup $HOME/.empe-chain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart emped && sudo journalctl -fu emped -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.empe-chain/config/genesis.json https://files.shazoes.xyz/testnets/empeiria/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.empe-chain/config/addrbook.json https://files.shazoes.xyz/testnets/empeiria/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://empeiria-testnet-rpc.itrocket.net"
  homeFolder=".empe-chain"
  binaryName="emped"
  maxPeers={25}
/>
</TabItem>
</Tabs>
