---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-zetachain">
# Zetachain Sync
</div>
<span className="sub-lines"> 
Chain ID: `zetachain_7000-1` | Node Version: `v1.0.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-zetachain.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop zetacored
```

### Backup priv_validator_state.json

```bash
cp $HOME/.zetacored/data/priv_validator_state.json $HOME/.zetacored/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
zetacored tendermint unsafe-reset-all --home $HOME/.zetacored --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-zetachain.tar.lz4 && lz4 -c -d snapshot-zetachain.tar.lz4 | tar -x -C $HOME/.zetacored && rm snapshot-zetachain.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.zetacored/priv_validator_state.json.backup $HOME/.zetacored/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart zetacored && sudo journalctl -fu zetacored -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop zetacored
```

### Backup priv_validator_state.json

```bash
cp $HOME/.zetacored/data/priv_validator_state.json $HOME/.zetacored/priv_validator_state.json.backup
```

### Reset the data

```bash
zetacored tendermint unsafe-reset-all --home $HOME/.zetacored
```

### Add Peers

```bash
PEERS="24ec0bb556800b8a8c1ff5c97993fbf7765377a9@zetachain-mainnet-rpc.shazoes.xyz:31156,72da7873feafa8abcb7f53f5b870abefc35b5431@88.99.68.249:22556,af8c2a64f121a0fbffe731eaf036b0f921ed36c9@65.109.48.230:32003,d055168f4afe65bbecb951ed1158307ce5b98cc2@95.217.141.114:22556,f9e0ea944362101cf56b424bf62e2f2bb24d946c@145.239.146.45:22556,9dc398c169ce93ef20dceb4bec48d75419b7ffe6@46.4.99.152:21850,e5ebdc30959a5cbb2b7898995ac8489fd91e3d6e@64.185.227.202:31850,967991134f32eb558cae3e4c5f8bd9adbd599177@52.79.168.185:26656,519d5b9f3ac4a0830ecdb1655eabf63e2217e8ae@40.160.16.84:26656,a6c1f55d027e00205386b24e932eb11c0b77de1c@144.76.98.185:31850,d9fff938cf9a3bc11e0da8a1592e84008ef70977@50.115.46.18:31850"
SNAP_RPC="https://zetachain-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.zetacored/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.zetacored/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.zetacored/priv_validator_state.json.backup $HOME/.zetacored/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart zetacored && sudo journalctl -fu zetacored -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.zetacored/config/genesis.json https://files.shazoes.xyz/mainnets/zetachain/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.zetacored/config/addrbook.json https://files.shazoes.xyz/mainnets/zetachain/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://zetachain-mainnet-rpc.shazoes.xyz"
  homeFolder=".zetacored"
  binaryName="zetacored"
  maxPeers={25}
/>
</TabItem>
</Tabs>
