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
 Chain ID: `atomone-1` | Node Version: `v2.0.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  chain="atomone"
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-atomone.json"
/>

### Install dependencies

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
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-atomone.tar.lz4 && lz4 -c -d snapshot-atomone.tar.lz4 | tar -x -C $HOME/.atomone && rm snapshot-atomone.tar.lz4
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
PEERS="9aceed722f09a3b0de202bbdd98dc345e2b84731@65.108.109.48:26656,61b7861a468dfa84532526afd98bea81bf41a874@121.78.247.244:16656,9524bac2c6be4d8b747e6b75d9b924000f9f6835@95.216.12.106:23456,755b3c1ecedb05ff08929da3b17174230a009182@138.201.200.188:29956,752bb5f1c914c5294e0844ddc908548115c1052c@65.108.236.5:14556,89757803f40da51678451735445ad40d5b15e059@169.155.169.178:26656,19477d71ab20a45630bb56a4a099200784d9dfd8@135.181.57.156:29956,bf3b173d9e1dc717fdaa7503119350c3411f6a7b@65.109.124.52:29956,f3c3918006dba796ed67715eba9dea2bcae083e9@125.131.208.67:12002,3bfca1233c3692985880e290fc598f15515adf5b@95.217.141.114:14556"
SNAP_RPC="https://atomone-mainnet-rpc.shazoes.xyz:443"
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
wget -O $HOME/.atomone/config/genesis.json https://files.shazoes.xyz/mainnets/atomone/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.atomone/config/addrbook.json https://files.shazoes.xyz/mainnets/atomone/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://atomone-mainnet-rpc.shazoes.xyz"
  homeFolder=".atomone"
  binaryName="atomoned"
  maxPeers={25}
/>
</TabItem>
</Tabs>
