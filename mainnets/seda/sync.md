---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="archived-notice-banner">
  <span className="badge-archive">ARCHIVE</span>
  <span className="notice-text">Network no longer actively validated · Services docs only</span>
</div>

<div className="h1-with-icon icon-seda">
# Seda Sync
</div>
<span className="sub-lines"> 
Chain ID: `seda-1` | Node Version: `v1.0.7`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-seda.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop sedad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.sedad/data/priv_validator_state.json $HOME/.sedad/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
sedad tendermint unsafe-reset-all --home $HOME/.sedad --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-seda.tar.lz4 && lz4 -c -d snapshot-seda.tar.lz4 | tar -x -C $HOME/.sedad && rm snapshot-seda.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.sedad/priv_validator_state.json.backup $HOME/.sedad/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart sedad && sudo journalctl -fu sedad -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop sedad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.sedad/data/priv_validator_state.json $HOME/.sedad/priv_validator_state.json.backup
```

### Reset the data

```bash
sedad tendermint unsafe-reset-all --home $HOME/.sedad
```

### Add Peers

```bash
PEERS="67b32792fdb84982b746172c3a599cda1c940247@seda-mainnet-rpc.shazoes.xyz:6656,a27fde2698f857562efcefdaf85ddd466782c78a@211.216.47.217:29656,702f09afd25bbfd21dac1ebe9a6098c6b31c72b4@65.108.98.235:24656,d9bfa29e0cf9c4ce0cc9c26d98e5d97228f93b0b@37.27.61.38:17356,9b6d05c97e7ee1d04899402b76608fb76bca7cd9@135.125.74.49:57056,6c153a3a12fd030b2d74e04f7da539b4fdd8165a@135.181.63.105:46656,4a75daf47b56decb10c858ca9524033e1a47e8ff@64.185.227.122:25856,90252c9b8c0946cd68f1aa544fa523569fdb97b3@65.109.115.172:25856,f3ca6398bd93b2c2b90b9bcc7e862a2c556b9eae@178.63.130.236:36656,1a87a68c8a03ecbf6d6e65d4ce780d72d5498c0f@65.108.71.137:25856,f6bdb78ff8c7487b9d6a1a3694ec7ecf3ddc2911@46.17.103.41:25856,8d91882539092d30091bd79d6837b6943362dcca@81.0.220.94:25856,f66b9d59461685d4687e272b03dd0f1b07036421@189.1.170.86:56176,5c66fc77b1bc1329f879ad4b12d2766a7e39ca34@23.129.20.120:25856,fe6ef8aac1b6e667b8aac2e01a659b607148d199@65.108.72.239:23656,3b620287baf6fb56342557955ff39a5d71f9fd71@38.146.3.231:25856,d8483e560bea268ddf8c1176b44571f6c09b9535@94.130.35.35:19656,1067a3d13bc82129b14078edb053be07966c15fe@113.161.132.233:13656,71620b329b80632f1b6d996c53d08c26fe8863f9@217.170.204.54:16656,e34624438ff1aaf2f0811f07c9a1aec5e205c43e@49.13.135.95:26656,44b419fd4c50d5f020d99815198fec9e0d65eeb7@46.4.23.120:17356,3a9b2d046e57d9e4194a4a2e552651bc8b732ded@46.4.29.231:3000,7c522356a7b56371d79c3b3e2e90cc0fbcabe123@65.108.99.37:44656,17fc8a4d8e5480e5626774013a40ca12edae9147@50.46.175.241:25856,1a00b931ca6ad065ebb59b4047188c35c7247e5e@37.252.186.105:3000,f9ad00c49bf013e1f36707d87702073a52875c8b@65.109.18.169:25856"
SNAP_RPC="https://seda-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.sedad/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.sedad/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.sedad/priv_validator_state.json.backup $HOME/.sedad/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart sedad && sudo journalctl -fu sedad -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.sedad/config/genesis.json https://files.shazoes.xyz/mainnets/seda/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.sedad/config/addrbook.json https://files.shazoes.xyz/mainnets/seda/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://seda-mainnet-rpc.shazoes.xyz"
  homeFolder=".sedad"
  binaryName="sedad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
