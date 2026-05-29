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
 Chain ID: `atomone-1` | Node Version: `v3.3.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  chain="atomone"
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-atomone.json"
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
PEERS="d7121ff09650ceacb1bad9c12246312ed9ef22f7@atomone-mainnet-rpc.shazoes.xyz:12656,57e11247cd5c12420c37e68fe3157bc51ca84ca3@78.46.79.242:26756,ae2b6af8f0e1dc3f8e1387fc9c3cee872879b2a0@135.181.181.59:24656,637077d431f618181597706810a65c826524fd74@103.87.58.191:29956,752bb5f1c914c5294e0844ddc908548115c1052c@65.108.236.5:14556,8688c5ed3e2e6ac0ca73eb5fe8ac69b9c0280abb@135.181.178.120:18656,755b3c1ecedb05ff08929da3b17174230a009182@138.201.200.188:29956,b212d5740b2e11e54f56b072dc13b6134650cfb5@169.155.168.195:26656,6a72ab6cc5aa0c3650a43d053eab3fc0e3dafdfd@167.235.49.172:61656,8772ddb3e4331f6404dc280c1bc5626099e227bc@65.21.234.111:15656,e1b058e5cfa2b836ddaa496b10911da62dcf182e@164.152.161.227:26656,3bfca1233c3692985880e290fc598f15515adf5b@95.217.141.114:14556,d3adcf9eee8665ee2d3108f721b3613cdd18c3a3@23.227.223.49:26656,19477d71ab20a45630bb56a4a099200784d9dfd8@135.181.57.156:29956,bf3b173d9e1dc717fdaa7503119350c3411f6a7b@65.109.124.52:29956,f19d9e0f8d48119aa4cafde65de923ae2c29181a@207.120.52.220:61656,089a0896841ef7757f72ca9bd57de616cdfd95e5@65.109.18.169:14556,05813d2a09b5d437a7d5cc0512c01c9ee51a8a8b@79.37.59.154:26656,79f1e0441a709df992633bde96d75b54e2cfad46@149.50.101.137:12956"
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
