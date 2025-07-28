---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-atomone">
# Atomone Sync
</div>
<span className="sub-lines"> 
Chain ID: `atomone-testnet-1` | Node Version: `v2.0.0-rc2`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-atomone.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop atomoned
```

### Backup priv_validator_state.json

```bash
cp $HOME/.atomone/data/priv_validator_state.json $HOME/.atomone/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
atomoned tendermint unsafe-reset-all --home $HOME/.atomone --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-atomone.tar.lz4 && lz4 -c -d snapshot-atomone.tar.lz4 | tar -x -C $HOME/.atomone && rm snapshot-atomone.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.atomone/priv_validator_state.json.backup $HOME/.atomone/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart atomoned && sudo journalctl -fu atomoned -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop atomoned
```

### Backup priv_validator_state.json

```bash
cp $HOME/.atomone/data/priv_validator_state.json $HOME/.atomone/priv_validator_state.json.backup
```

### Reset the data

```bash
atomoned tendermint unsafe-reset-all --home $HOME/.atomone
```

### Add Peers

```bash
PEERS="501385f2af01465f64ef1c08b9438e06742222a6@atomone-testnet-rpc.shazoes.xyz:31656,60355b701ce2d83ec3ad42271a4202d6b6728cf4@135.181.178.120:15656,75ccd37e1ce38d1efde90c293ff8d1ffcf7e3bfa@188.165.226.46:26706,2231b2285c3ba2f0dec145633d5bc90b8cf782bd@161.97.77.219:26656,5861b1bde33340c443d75c7727525711ccc0b825@65.108.226.44:14556,dd27a23e0adc98d6dc53802d95ce581b06723845@185.252.233.217:26656,4df42d308b1aafb2e1efebda744441d75507c1a8@94.130.164.82:14556,112c3c63d5fa03dbfb917d41c1ab9f8412b44128@37.27.63.150:27956,9c2e0452539d913214048111afd4872ea2edd32f@65.108.206.118:61356,85e441cfe74b8c0f8b820beff46edab20e92716c@8.52.201.252:62656"
SNAP_RPC="https://atomone-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.atomone/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.atomone/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.atomone/priv_validator_state.json.backup $HOME/.atomone/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart atomoned && sudo journalctl -fu atomoned -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.atomone/config/genesis.json https://files.shazoes.xyz/testnets/atomone/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.atomone/config/addrbook.json https://files.shazoes.xyz/testnets/atomone/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://atomone-testnet-rpc.shazoes.xyz"
  homeFolder=".atomone"
  binaryName="atomoned"
  maxPeers={25}
/>
</TabItem>
</Tabs>
