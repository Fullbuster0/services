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

<div className="h1-with-icon icon-story">
# Story  Sync
</div>
<span className="sub-lines"> 
Chain ID: `aeneid` | Node Version: `v1.3.0`
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
sudo systemctl stop story story-geth
```

### Backup priv_validator_state.json

```bash
cp $HOME/.story/story/data/priv_validator_state.json $HOME/.story/story/priv_validator_state.json.backup
```

### Remove Story Data

```bash
rm -rf $HOME/.story/story/data
```

### Download Story Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-story.tar.lz4 && lz4 -c -d snapshot-story.tar.lz4 | tar -x -C $HOME/.story && rm snapshot-story.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.story/priv_validator_state.json.backup $HOME/.story/data/priv_validator_state.json
```

### Delete Geth Data

```bash
rm -rf $HOME/.story/geth/aeneid/geth/chaindata
```

### Download Geth Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-story-geth.tar.lz4 && lz4 -c -d snapshot-storygeth.tar.lz4 | tar -x -C $HOME/.story/geth/aeneid/geth
```

### Restart Service

```bash
sudo systemctl restart story story-geth  && sudo journalctl u story -u story-geth -f -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop story
```

### Backup priv_validator_state.json

```bash
cp $HOME/.story/data/priv_validator_state.json $HOME/.story/priv_validator_state.json.backup
```

### Reset the data

```bash
story tendermint unsafe-reset-all --home $HOME/.story
```

### Add Peers

```bash
PEERS="381b10bd04853b375f9a1d42983a0fbfa753e4aa@37.59.22.162:26656,b66b0df0720b38f9405f8a5c50511365ec621b2a@135.181.181.59:62656,7160dec63da82b56e1ce59a93c057c05e361cf85@135.181.117.37:64656,db6791a8e35dee076de75aebae3c89df8bba3374@65.109.50.22:56656,a8d01e154197d799637eca4f0f369dc215db6b70@144.76.111.9:26656,9d34ab3819aa8baa75589f99138318acfa0045f5@95.217.119.251:30900,5eb1d392045c1159a94bdb49916341ac4a787500@157.180.93.155:52656,34c910cde040e983f076195175ed2fe7d447b486@152.53.102.226:26656,dfb96be7e47cd76762c1dd45a5f76e536be47faa@65.108.45.34:32655,ae49103a54f77effa438978ad8a7ba09b6f20da0@144.76.202.120:35656,311cd3903e25ab85e5a26c44510fbc747ab61760@152.53.87.97:36656"
SNAP_RPC="https://story-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.story/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.story/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.story/priv_validator_state.json.backup $HOME/.story/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart story && sudo journalctl -fu story -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.story/config/genesis.json https://files.shazoes.xyz/testnets/story/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.story/config/addrbook.json https://files.shazoes.xyz/testnets/story/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://story-testnet-rpc.itrocket.net"
  homeFolder=".story"
  binaryName="story"
  maxPeers={25}
/>
</TabItem>
</Tabs>
