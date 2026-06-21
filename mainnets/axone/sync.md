---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-axone">
# Axone Protocol Sync
</div>
<span className="sub-lines"> 
Chain ID: `axone-1` | Node Version: `v1.0.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-axone.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop axoned
```

### Backup priv_validator_state.json

```bash
cp $HOME/.axoned/data/priv_validator_state.json $HOME/.axoned/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
axoned tendermint unsafe-reset-all --home $HOME/.axoned --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-axone.tar.lz4 && lz4 -c -d snapshot-axone.tar.lz4 | tar -x -C $HOME/.axoned && rm snapshot-axone.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.axoned/priv_validator_state.json.backup $HOME/.axoned/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart axoned && sudo journalctl -fu axoned -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop axoned
```

### Backup priv_validator_state.json

```bash
cp $HOME/.axoned/data/priv_validator_state.json $HOME/.axoned/priv_validator_state.json.backup
```

### Reset the data

```bash
axoned tendermint unsafe-reset-all --home $HOME/.axoned
```

### Add Peers

```bash
PEERS="3e5835a2ed3161171fcd19212573b6a7f63b7752@axone-mainnet-rpc.shazoes.xyz:30456,f05efa118b4a058355019fd0a564be807cef1d33@152.53.85.0:17656,1a3f24c751b7aa5a4cd449ecea9e62208fedca74@162.55.87.26:43256,a7a78aca8704b913337c1ed2a0c76892ad3ab985@104.248.131.60:19007,a3fa14196d8cd05e16eb58e825f2b136a029e28b@65.108.45.119:38656,b9e0d01112a783907f5269517c6be488e9957166@198.96.92.242:26816,1849d58c77c446feae4bf8ad109f494dfc69a268@113.161.132.233:18656,5daeb57d78d5e28e03eab6946bcc010ba01adf47@176.9.92.135:61056,30d5123dd8b0c4b8e02b0780d58898d18a3d218d@65.108.198.145:18656,17cadb3115c706bd0338a081121c6c7252b7a5f2@65.21.237.228:26112,8e59c916d235915a19fd53a84608b5969fae1453@78.46.36.203:17656,9e250572a6a1970a916f9be762dae53e3e56bc37@65.109.18.169:20056,36e303f2c63c51ed15b662b50c651f19505a689a@135.181.5.232:17656,b3951a48d92024e1dcc5db1ec5b5452ea8cea7af@144.76.74.73:20056,b65c7e9299571dfeaeb637ea73fd12440e1b9924@65.108.201.218:17656,3331cda07af7ecdee5594b1ab56075a2081ae6d3@93.125.49.130:26659,dcc0c9c254bdb81107b61f30ddb5f9ed32f24645@168.119.143.51:18656,740741048700f4e8cc1fb6609bddc569e5b9d6d5@65.108.236.5:20056,79b76f242dc571f2808402a8674b71af614f4286@65.109.112.170:20056,17e6e445d79b608df52c36d9eae1deb32101f40f@116.202.218.189:31656,a93258bc1fee00ce378829153e69a253b49cbeb1@65.109.112.148:10096,64cabf63788b91fbbc89bea7eb46516a7ef24d14@65.109.65.210:42656"
SNAP_RPC="https://axone-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.axoned/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.axoned/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.axoned/priv_validator_state.json.backup $HOME/.axoned/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart axoned && sudo journalctl -fu axoned -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.axoned/config/genesis.json https://files.shazoes.xyz/mainnets/axone/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.axoned/config/addrbook.json https://files.shazoes.xyz/mainnets/axone/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://axone-mainnet-rpc.shazoes.xyz"
  homeFolder=".axoned"
  binaryName="axoned"
  maxPeers={25}
/>
</TabItem>
</Tabs>
