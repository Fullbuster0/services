---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-fuel">
# Fuel Sync
</div>
<span className="sub-lines"> 
Chain ID: `seq-mainnet-1` | Node Version: `seq-mainnet-1.2`
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
sudo systemctl stop fuelsequencerd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.fuelsequencer/data/priv_validator_state.json $HOME/.fuelsequencer/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
fuelsequencerd tendermint unsafe-reset-all --home $HOME/.fuelsequencer --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-fuel.tar.lz4 && lz4 -c -d snapshot-fuel.tar.lz4 | tar -x -C $HOME/.fuelsequencer && rm snapshot-fuel.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.fuelsequencer/priv_validator_state.json.backup $HOME/.fuelsequencer/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart fuelsequencerd && sudo journalctl -fu fuelsequencerd -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop fuelsequencerd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.fuelsequencer/data/priv_validator_state.json $HOME/.fuelsequencer/priv_validator_state.json.backup
```

### Reset the data

```bash
fuelsequencerd tendermint unsafe-reset-all --home $HOME/.fuelsequencer
```

### Add Peers

```bash
PEERS="1d74e8049fdc35ec5a8d26d058a06b642c0adf6a@74.50.67.222:26858,0fd7064ac6b984aa648a69d68c65e3f498668780@8.244.153.12:63656,540efd57749223b1400475e121addbddca972916@185.107.68.176:26656,1b6753264d5939f78bf365c867781be61f3efc9e@185.246.84.125:26656,478d6a599ac3e2b93a3622a635c378804b26975a@162.19.83.215:58456,445952b74b508ba5915f3c2f0a8d169a409f174b@57.129.64.92:26656,fc5fd264190e4a78612ec589994646268b81f14e@80.64.208.207:26656,dc7b01b0379f660fb59223b9862cef0db11f14d9@152.53.121.42:19656,c0a07e7942ed5482cfd1cfbfe0bfce76db0dcc9c@221.148.45.118:27656,d87dfe68db586fecc1141b0de687cbd72f1e131e@207.180.215.245:26656"
SNAP_RPC="https://fuel-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.fuelsequencer/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.fuelsequencer/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.fuelsequencer/priv_validator_state.json.backup $HOME/.fuelsequencer/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart fuelsequencerd && sudo journalctl -fu fuelsequencerd -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.fuelsequencer/config/genesis.json https://files.shazoes.xyz/mainnets/fuel/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.fuelsequencer/config/addrbook.json https://files.shazoes.xyz/mainnets/fuel/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://rpc-fuel-seq.simplystaking.xyz"
  homeFolder=".fuelsequencer"
  binaryName="fuelsequencerd"
  maxPeers={25}
/>
</TabItem>
</Tabs>
