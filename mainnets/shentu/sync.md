---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-shentu">
# Shentu Sync
</div>
<span className="sub-lines"> 
Chain ID: `shentu-2.2` | Node Version: `v2.16.2`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot1.shazoes.xyz/mainnets/metadata-shentu.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop shentud
```

### Backup priv_validator_state.json

```bash
cp $HOME/.shentud/data/priv_validator_state.json $HOME/.shentud/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
shentud tendermint unsafe-reset-all --home $HOME/.shentud --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot1.shazoes.xyz/mainnets/snapshot-shentu.tar.lz4 && lz4 -c -d snapshot-shentu.tar.lz4 | tar -x -C $HOME/.shentud && rm snapshot-shentu.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.shentud/priv_validator_state.json.backup $HOME/.shentud/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart shentud && sudo journalctl -fu shentud -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop shentud
```

### Backup priv_validator_state.json

```bash
cp $HOME/.shentud/data/priv_validator_state.json $HOME/.shentud/priv_validator_state.json.backup
```

### Reset the data

```bash
shentud tendermint unsafe-reset-all --home $HOME/.shentud
```

### Add Peers

```bash
PEERS="f1a5fd39e7a3a09dc93080ac456aae052e0beb37@shentu-mainnet-rpc.shazoes.xyz:9656,207c47bed435e4174844064ef3f51ca35b059de2@5.189.128.119:26656,32e2f9106d29ae9998c37e10adde030dbe223fb7@65.108.98.235:26956,8931f8b5ae31e472c074a000b2d9f729c7ef4374@65.108.121.227:14056,32efae2d1cc2c01b87a3b925a8c37025e4a2f58a@116.96.45.205:26656,147eeac0de54a973ade15e46ca427b70d0d535b2@135.181.128.114:14056,1480912d16f26b5ea1c4fea2496da95e44cbe845@65.109.115.226:14056,a8cd59ec2777e95d5b25278fd46f5069b2f8c25a@5.9.97.174:15607,1c6c01bf6504206bdaa37bb02076b6c8a3d77338@8.208.44.73:26656,43f600ff746ad1d2dde47bbfe2aa18dd5fc08ff6@65.21.136.219:26656,75f067aa1d40ddadb1d32606fdbff16683e4b9d3@37.27.58.244:26656,e3f35c5abe22423f654c5e1b33318fbee7503cb3@149.202.64.145:27656,29dec607ea0c295cafd0a50eb6cce53e603ff35a@37.27.53.176:14056,94e911d79176c2ac90ce545b212429460dd34d5e@35.74.10.164:6656,af55cb6531fd5e5818b374e312ee9f5b6ac471bb@65.21.167.185:14056,f97807210f9547b8a5016fb18000b46072ca5e30@135.181.113.227:2407,dcceb7e119765d6ff54cb16fef8d008ba9099d56@52.202.184.217:26656,3c1740cb7d646a31bc3236a7fb3cba1cc87eb08e@5.9.147.138:28656"
SNAP_RPC="https://shentu-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.shentud/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.shentud/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.shentud/priv_validator_state.json.backup $HOME/.shentud/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart shentud && sudo journalctl -fu shentud -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.shentud/config/genesis.json https://files.shazoes.xyz/mainnets/shentu/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.shentud/config/addrbook.json https://files.shazoes.xyz/mainnets/shentu/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://shentu-mainnet-rpc.shazoes.xyz"
  homeFolder=".shentud"
  binaryName="shentud"
  maxPeers={25}
/>
</TabItem>
</Tabs>
