---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-lava">
# Lava Sync
</div>
<span className="sub-lines"> 
Chain ID: `lava-mainnet-1` | Node Version: `v5.5.1`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot1.shazoes.xyz/mainnets/metadata-lava.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop lavad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.lava/data/priv_validator_state.json $HOME/.lava/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
lavad tendermint unsafe-reset-all --home $HOME/.lava --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot1.shazoes.xyz/mainnets/snapshot-lava.tar.lz4 && lz4 -c -d snapshot-lava.tar.lz4 | tar -x -C $HOME/.lava && rm snapshot-lava.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.lava/priv_validator_state.json.backup $HOME/.lava/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart lavad && sudo journalctl -fu lavad -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop lavad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.lava/data/priv_validator_state.json $HOME/.lava/priv_validator_state.json.backup
```

### Reset the data

```bash
lavad tendermint unsafe-reset-all --home $HOME/.lava
```

### Add Peers

```bash
PEERS="883e8ced6fc2f1fea0074b8f8a2f3edc612c1a12@lava-mainnet-rpc.shazoes.xyz:30756,839d29381d912fe7d16bd198ab4a774466241d5f@5.9.96.28:7656,5a1f54b549ec61580f648ba2c2e5491089021809@65.109.92.163:10020,94bc6b515853489f13f8e497b5a8652e22d49f73@88.218.224.46:56656,b96f992e06b9193b95fcc1da445bb30c6caf1a8a@144.76.111.245:26656,7d7968e8e37c62b49daa567fb94e170101ae7551@103.241.50.31:26656,f0b1a7171fb7d5990593d5a0675c1e4b9fa5e0f4@65.108.207.225:26656,408ddeb68bd2cc5e6ff1b3ed17ac1e79b70cb356@51.161.172.54:55676,0696338a19213a6b2044fe2c0a99272b14844c85@5.9.116.185:26656,18a80499a523121593c255e5c56d5672d54c32ec@162.19.10.128:26656"
SNAP_RPC="https://lava-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.lava/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.lava/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.lava/priv_validator_state.json.backup $HOME/.lava/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart lavad && sudo journalctl -fu lavad -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.lava/config/genesis.json https://files.shazoes.xyz/mainnets/lava/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.lava/config/addrbook.json https://files.shazoes.xyz/mainnets/lava/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://lava-mainnet-rpc.shazoes.xyz"
  homeFolder=".lava"
  binaryName="lavad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
