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
Chain ID: `shentu-2.2` | Node Version: `v2.14.1`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-shentu.json"
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
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-shentu.tar.lz4 && lz4 -c -d snapshot-shentu.tar.lz4 | tar -x -C $HOME/.shentud && rm snapshot-shentu.tar.lz4
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
PEERS="e3f35c5abe22423f654c5e1b33318fbee7503cb3@149.202.64.145:27656,1480912d16f26b5ea1c4fea2496da95e44cbe845@65.109.115.226:14056,b6d870a3925baf56a70ea4d0a6a86f71d021257c@31.220.77.51:26656,722370de4cb68e3bcc7133b50e2c0e03110026de@209.145.56.75:26656,c7053b17cb50e6b190820fce2dc45b37ad479948@88.198.168.154:26656,c7f47b19bad10c2222ad528c73627a14e0108e9d@95.217.116.103:26456,a9f5bc2294cd41b3677337305309ae9687dfa8d5@8.208.44.201:26656,43b923d403b569575fbee4eef1c0fb0c5d39be2f@165.232.72.33:26656,20157e5c6538f1750618972db3c0d171dae8cf8c@209.159.150.62:26656,89757803f40da51678451735445ad40d5b15e059@169.155.169.81:26656,6abc14fdb30ea57be013a9021ffb75378fe4d11c@178.18.250.33:14056,3ca62ad1846b426835f28fd81ccd748007fb51c2@49.13.15.59:26656,4ba3f83efc53c834ba27eb22452840ee74aecf45@85.215.105.19:15604,1fa010a89dedf7dbb91c8239a4fe00c14ffe8715@161.97.133.184:26656,a8cd59ec2777e95d5b25278fd46f5069b2f8c25a@5.9.97.174:15607,d4cbdef21bde1fde444cd31f5a2842c76268f210@94.250.203.213:26656,207c47bed435e4174844064ef3f51ca35b059de2@5.189.128.119:26656,ed4db976ce074bfda0f436790f00e5a0716b4cc7@94.250.202.43:14056,32e2f9106d29ae9998c37e10adde030dbe223fb7@65.108.98.235:26956,e75aab6f20e0ac794e9aae1c18c89e428d381bda@195.201.167.242:26656,e3acfacbd8f08c8e61925a3363187b2737022407@47.253.53.245:26656,af55cb6531fd5e5818b374e312ee9f5b6ac471bb@65.21.167.185:14056,8888cb6071b560e2a5393394ea8d6babaaa33184@178.238.228.120:26656,94e911d79176c2ac90ce545b212429460dd34d5e@35.74.10.164:6656,9c0b20c318d0ee8f84475ad47afed59b24ba2ea4@95.217.193.17:26656,060027d3bc10ff7ebc1ec315ae5671c541e1568c@66.45.246.166:20016,3c1740cb7d646a31bc3236a7fb3cba1cc87eb08e@5.9.147.138:28656"
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
