---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-mantra">
# Mantra Sync
</div>
<span className="sub-lines"> 
Chain ID: `mantra-1` | Node Version: `v6.1.4`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot1.shazoes.xyz/mainnets/metadata-mantra.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop mantrachaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.mantrachain/data/priv_validator_state.json $HOME/.mantrachain/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
mantrachaind comet unsafe-reset-all --home $HOME/.mantrachain --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot1.shazoes.xyz/mainnets/snapshot-mantra.tar.lz4 && lz4 -c -d snapshot-mantra.tar.lz4 | tar -x -C $HOME/.mantrachain && rm snapshot-mantra.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.mantrachain/priv_validator_state.json.backup $HOME/.mantrachain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart mantrachaind && sudo journalctl -fu mantrachaind -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop mantrachaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.mantrachain/data/priv_validator_state.json $HOME/.mantrachain/priv_validator_state.json.backup
```

### Reset the data

```bash
mantrachaind comet unsafe-reset-all --home $HOME/.mantrachain
```

### Add Peers

```bash
PEERS="06c502cda1a3efacb9997522c07c8c8b801e74f1@mantra-mainnet-rpc.shazoes.xyz:31256,ddf57b62c47bc843dd0844d1a75fb95db9b695ed@37.27.108.165:26006,dc5ccb3ed2d7e4b822ef6ac5b64bede4d122115c@65.21.136.219:26656,e378364a714e86f034ba310506fa0e917b3d1db7@195.201.115.0:44656,57988eaefb806c67020cf2f6fa3c713945818f2f@142.132.187.206:26656,60fdb2298cf47a93c8cf173ef785f7d4a2d4d3fb@65.108.201.138:25156,03b4bc5c9f9ea90c29b8016752e40e03a7e16221@34.18.105.95:26656,4de3d0e0ce97a8d130443c8ed4db4876147a3cc5@34.18.44.219:26656,284fc3f98e735142b0b9f55db7896059f76e40a4@35.220.168.91:26656,c1183d59637c454557934c1896fcd312641b80cb@47.129.143.107:26656,fef97d99c827bc39db8a291dcdd3381d6390f45c@5.161.205.87:26656,ae2d751629284caa0166a4265dbb80c48ad3b40e@176.9.30.178:25156,6cd6d1682de686f8cac1a40e353e71742ca165e5@5.9.73.170:25156,f73043eb78ece59665befbcf998d5670fb8eb406@35.220.230.175:26656,482d9fa4bfcd01dd217498d7268b6b89b06f153c@34.18.182.211:26656,1e71bd43ee1e2541138c66dd9f37f786b491f89f@139.59.229.166:26656,2f4804aad290b5099792c15cccb47f40d42b9ab9@65.108.230.146:25156,7c5f9b4a400d259900cdea7a8f1d30ede263daef@135.181.138.95:2220"
SNAP_RPC="https://mantra-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.mantrachain/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.mantrachain/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.mantrachain/priv_validator_state.json.backup $HOME/.mantrachain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart mantrachaind && sudo journalctl -fu mantrachaind -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.mantrachain/config/genesis.json https://files.shazoes.xyz/mainnets/mantra/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.mantrachain/config/addrbook.json https://files.shazoes.xyz/mainnets/mantra/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://mantra-mainnet-rpc.shazoes.xyz"
  homeFolder=".mantrachain"
  binaryName="mantrachaind"
  maxPeers={25}
/>
</TabItem>
</Tabs>
