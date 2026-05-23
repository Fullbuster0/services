---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Sync
</div>
<span className="sub-lines"> 
Chain ID: `hippo-protocol-testnet-1` | Node Version: `v2.0.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-hippo.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop hippod
```

### Backup priv_validator_state.json

```bash
cp $HOME/.hippo/data/priv_validator_state.json $HOME/.hippo/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
hippod tendermint unsafe-reset-all --home $HOME/.hippo --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-hippo.tar.lz4 && lz4 -c -d snapshot-hippo.tar.lz4 | tar -x -C $HOME/.hippo && rm snapshot-hippo.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.hippo/priv_validator_state.json.backup $HOME/.hippo/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop hippod
```

### Backup priv_validator_state.json

```bash
cp $HOME/.hippo/data/priv_validator_state.json $HOME/.hippo/priv_validator_state.json.backup
```

### Reset the data

```bash
hippod tendermint unsafe-reset-all --home $HOME/.hippo
```

### Add Peers

```bash
PEERS="593f4477565e6c063a06871103a528de761c3537@hippo-testnet-rpc.shazoes.xyz:37656,44d8d63d81c35202568ed6970851ec1bb560ef0c@184.107.57.139:60000,d7644db333653ffbf155f5dc1fff176010eb0a96@44.245.117.224:26656"
SNAP_RPC="https://hippo-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.hippo/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.hippo/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.hippo/priv_validator_state.json.backup $HOME/.hippo/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.hippo/config/genesis.json https://files.shazoes.xyz/testnets/hippo/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.hippo/config/addrbook.json https://files.shazoes.xyz/testnets/hippo/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://hippo-testnet-rpc.shazoes.xyz"
  homeFolder=".hippo"
  binaryName="hippod"
  maxPeers={25}
/>
</TabItem>
</Tabs>
