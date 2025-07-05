---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-babylon">
# Babylon Sync
</div>
<span className="sub-lines"> 
Chain ID: `bbn-1` | Node Version: `v2.2.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-babylon.json"
/>

### Install dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop babylond
```

### Backup priv_validator_state.json

```bash
cp $HOME/.babylond/data/priv_validator_state.json $HOME/.babylond/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
babylond tendermint unsafe-reset-all --home $HOME/.babylond --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-babylon.tar.lz4 && lz4 -c -d snapshot-babylon.tar.lz4 | tar -x -C $HOME/.babylond && rm snapshot-babylon.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.babylond/priv_validator_state.json.backup $HOME/.babylond/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart babylond && sudo journalctl -fu babylond -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop babylond
```

### Backup priv_validator_state.json

```bash
cp $HOME/.babylond/data/priv_validator_state.json $HOME/.babylond/priv_validator_state.json.backup
```

### Reset the data

```bash
babylond tendermint unsafe-reset-all --home $HOME/.babylond
```

### Add Peers

```bash
PEERS="bfd985bcc5e512f492fd206d6a973775ecd9a000@45.32.126.22:26656,4caf0eceae6c8ad2c819da35d04624b2e79a7451@176.158.37.176:29656,e4ab225d6c4c0d0bf06a6610e07a5f29c2325bf5@88.99.101.149:20656,e80aa0305bea31f930facf5547e37c731ffffbc4@78.46.174.72:20656,2acadbf9b3c8773513297d69b0f8869682e5806d@141.94.193.28:55706,454df8943ff6e90f2055e5f9c2907e1fd41319e0@91.134.78.98:26656,0b0561b615a382500311bff9bb380f2c39cd8334@67.213.114.49:26656,38badf1db162e9b7ddc8afbad1cf322567b452b1@207.148.118.251:26656,8801b65a1c324391e62ff256e93ecd8f3c61a19d@74.118.143.212:26656,37c7c90242166045f3cd0e3baf626212a9dd80be@51.161.172.54:55706"
SNAP_RPC="https://babylon-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.babylond/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.babylond/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.babylond/priv_validator_state.json.backup $HOME/.babylond/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart babylond && sudo journalctl -fu babylond -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.babylond/config/genesis.json https://files.shazoes.xyz/mainnets/babylon/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.babylond/config/addrbook.json https://files.shazoes.xyz/mainnets/babylon/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://babylon-mainnet-rpc.shazoes.xyz"
  homeFolder=".babylond"
  binaryName="babylond"
  maxPeers={25}
/>
</TabItem>
</Tabs>
