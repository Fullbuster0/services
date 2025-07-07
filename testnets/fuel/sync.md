---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-fuel">
# fuel Sync
</div>
<span className="sub-lines"> 
Chain ID: `seq-testnet-2` | Node Version: `seq-testnet-2.2`
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
sudo systemctl stop fuelsequencerd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.fuelsequencer/data/priv_validator_state.json $HOME/.fuelsequencer/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
fuelsequencerd tendermint unsafe-reset-all --home $HOME/.fuelsequencer --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-fuel.tar.lz4 && lz4 -c -d snapshot-fuel.tar.lz4 | tar -x -C $HOME/.fuelsequencer && rm snapshot-fuel.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.fuelsequencer/priv_validator_state.json.backup $HOME/.fuelsequencer/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart fuelsequencerd && sudo journalctl -fu fuelsequencerd -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop fuelsequencerd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.fuelsequencer/data/priv_validator_state.json $HOME/.fuelsequencer/priv_validator_state.json.backup
```

### Reset the data

```bash
fuelsequencerd tendermint unsafe-reset-all --home $HOME/.fuelsequencer
```

### Add Peers

```bash
PEERS="1b8d017eff27b87ec78d720cf50b3093ce60377f@65.109.64.99:32340,25bd839624c4044764446a9241fbfb295d1e2233@80.64.208.18:26656,3a0b4118c01addd33d5add81783805d5add2fb17@80.64.208.17:26656,3229bf11feb400b2699502222cfcbfc940bdedaa@5.9.73.170:29656"
SNAP_RPC="https://fuel-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.fuelsequencer/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.fuelsequencer/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.fuelsequencer/priv_validator_state.json.backup $HOME/.fuelsequencer/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart fuelsequencerd && sudo journalctl -fu fuelsequencerd -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.fuelsequencer/config/genesis.json https://files.shazoes.xyz/testnets/fuel/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.fuelsequencer/config/addrbook.json https://files.shazoes.xyz/testnets/fuel/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://fuel-testnet-rpc.shazoes.xyz"
  homeFolder=".fuelsequencer"
  binaryName="fuelsequencerd"
  maxPeers={25}
/>
</TabItem>
</Tabs>
