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
PEERS="f98acb897e5d0e684cddb546aeeeb0006480810a@mantra-mainnet-rpc.shazoes.xyz:31256,0926c9c1438276d08899ca932f646af09ed9c66f@65.108.207.104:40156,472ce5a106d5a3079a3efdde4cef3d1ff4787810@147.135.223.144:26656,231c585900827a9e595f4483dcf45e3fa9b03868@162.55.237.11:26656,9e2588bb4b8ba2929e33818f6e6c2e2bb03ce08e@65.108.121.190:2020,ebe72e45b1d96906eb211ce7ed74c4a94dbf826a@46.105.223.14:26661,05da0d5d92443ba91f4ecbb9dc003d540b4cd0a6@35.212.136.69:26656,b1c3e2ff8c317df3b2716292a68e007274abe657@185.119.118.111:2000,f051f9d5b936db716539a7f9cc9f0dfeae467fea@65.21.235.237:26656,4ebf87085c2a3cc65d09549938985cf72a3c7734@65.108.97.229:26656,5c9660660ff89f90dff53f512a5bc979cddd292a@5.134.61.234:36656"
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
