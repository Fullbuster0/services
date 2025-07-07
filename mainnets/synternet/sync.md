---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-synternet">
# Synternet Sync
</div>
<span className="sub-lines"> 
Chain ID: `synternet-1` | Node Version: `v0.25`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-synternet.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop syntd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.amber/data/priv_validator_state.json $HOME/.amber/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
syntd tendermint unsafe-reset-all --home $HOME/.amber --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-synternet.tar.lz4 && lz4 -c -d snapshot-synternet.tar.lz4 | tar -x -C $HOME/.amber && rm snapshot-synternet.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.amber/priv_validator_state.json.backup $HOME/.amber/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart syntd && sudo journalctl -fu syntd -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop syntd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.amber/data/priv_validator_state.json $HOME/.amber/priv_validator_state.json.backup
```

### Reset the data

```bash
syntd tendermint unsafe-reset-all --home $HOME/.amber
```

### Add Peers

```bash
PEERS="e74678c231cd86944f9819244f0a3879576ebd80@148.251.176.12:3000,613e8033a587340d08144084300b003bcfe2ca43@79.137.10.226:26656,2eed7e175d204680af243e008e21950f81b8d455@34.89.206.173:26656,95b14ec701608044c261ebd15d0b3bd84e295acb@72.46.84.135:26656,994a52988585be44a90574f4dc73a9bfbddd528e@37.252.186.222:26656,5684069fabe946bea91dabbdac0cae069888dfb4@65.21.234.111:31656,38f7accfdbc6690a60837c397d22457a0f08a362@37.27.57.224:26656,13af4eef823f8c9cac093dbc405edff280dc9d87@78.141.193.216:26656"
SNAP_RPC="https://synternet-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.amber/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.amber/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.amber/priv_validator_state.json.backup $HOME/.amber/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart syntd && sudo journalctl -fu syntd -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.amber/config/genesis.json https://files.shazoes.xyz/mainnets/synternet/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.amber/config/addrbook.json https://files.shazoes.xyz/mainnets/synternet/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://synternet-mainnet-rpc.shazoes.xyz"
  homeFolder=".amber"
  binaryName="syntd"
  maxPeers={25}
/>
</TabItem>
</Tabs>
