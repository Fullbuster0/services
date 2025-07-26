---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-lumera">
# Lumera Protocol Sync
</div>
<span className="sub-lines"> 
Chain ID: `lumera-mainnet-1` | Node Version: `v1.6.1`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-lumera.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop lumerad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.lumera/data/priv_validator_state.json $HOME/.lumera/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
lumerad tendermint unsafe-reset-all --home $HOME/.lumera --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-lumera.tar.lz4 && lz4 -c -d snapshot-lumera.tar.lz4 | tar -x -C $HOME/.lumera && rm snapshot-lumera.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.lumera/priv_validator_state.json.backup $HOME/.lumera/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart lumerad && sudo journalctl -fu lumerad -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop lumerad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.lumera/data/priv_validator_state.json $HOME/.lumera/priv_validator_state.json.backup
```

### Reset the data

```bash
lumerad tendermint unsafe-reset-all --home $HOME/.lumera
```

### Add Peers

```bash
PEERS="277773c00a7f7029775deba6e28532c40b670d16@lumera-mainnet-rpc.shazoes.xyz:30356,e1cedc37b9871332098d0a3ca2736813c92cedff@168.119.143.51:13656,e2c647e88db4deb2453cdbf2f08f98a1718e9e16@65.21.135.111:13656,ddd091cecab267b467f9f6167e9268391fc0ec1f@57.128.98.34:20001,385612fc40ace419dfb637e4f6e01ace4eb6897c@23.129.20.122:30756,faf9bc564f4d200d741da088731b6b3ba02192aa@65.108.232.93:30756,1636695e77723187f9d9bd6df3faae092712ca13@65.109.61.125:30756,8a6051b510f8adc802aece2e29976eabf3208eb5@96.230.25.243:26656,5b8d4baa4e4c86b94322d452dc66c4bf218cfc95@184.107.244.74:12300,1ef18bb3ed8efee9fb150151cbcdfca438fa9db4@64.185.227.242:30756,54361f222e87b7dd1cb90973079c44e7e31c03e5@15.235.42.134:12300,b7d5153841be7a3f1196767f55aa4817bb3cead0@148.113.162.70:12300,ab5b0bafe670543d6f25dea19a264c7da1e50672@65.108.201.240:30756"
SNAP_RPC="https://lumera-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.lumera/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.lumera/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.lumera/priv_validator_state.json.backup $HOME/.lumera/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart lumerad && sudo journalctl -fu lumerad -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.lumera/config/genesis.json https://files.shazoes.xyz/mainnets/lumera/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.lumera/config/addrbook.json https://files.shazoes.xyz/mainnets/lumera/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://lumera-mainnet-rpc.shazoes.xyz"
  homeFolder=".lumera"
  binaryName="lumerad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
