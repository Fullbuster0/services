---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-warden">
# Warden Sync
</div>
<span className="sub-lines"> 
Chain ID: `barra_9191-1` | Node Version: `v0.7.0-rc3`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-warden.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop wardend
```

### Backup priv_validator_state.json

```bash
cp $HOME/.warden/data/priv_validator_state.json $HOME/.warden/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
wardend tendermint unsafe-reset-all --home $HOME/.warden --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-warden.tar.lz4 && lz4 -c -d snapshot-warden.tar.lz4 | tar -x -C $HOME/.warden && rm snapshot-warden.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.warden/priv_validator_state.json.backup $HOME/.warden/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart wardend && sudo journalctl -fu wardend -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop wardend
```

### Backup priv_validator_state.json

```bash
cp $HOME/.warden/data/priv_validator_state.json $HOME/.warden/priv_validator_state.json.backup
```

### Reset the data

```bash
wardend tendermint unsafe-reset-all --home $HOME/.warden
```

### Add Peers

```bash
PEERS="a073ca67b879785714fbced8d91c254aa475c1f7@warden-testnet-rpc.shazoes.xyz:29656,a416f0a5a925a3cd40ceb166aeab43e71748c1dc@95.217.109.206:11956,9c7564f341a9ac63217b7bc8f1de65cbecb09f55@188.40.66.173:27356,c489c003b7c72298840bd4411ffc98ce13e07c27@54.194.136.183:26656,4564c91423a923eaba7982e69e33aec6185d362f@54.72.5.234:26656,30b1384f9f4ae8a1644dabb92ad4715a8b155404@51.79.78.121:26656,fb3c995373c0feee597dd3ed32e56cb5e0f0d1c2@65.108.120.161:26726,92bf4175907fe1348820595c2c01db411304ec62@135.181.59.112:12756,6089ea41e8003ebf81e22f1f78d7558c5e20b302@144.76.29.90:61256"
SNAP_RPC="https://warden-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.warden/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.warden/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.warden/priv_validator_state.json.backup $HOME/.warden/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart wardend && sudo journalctl -fu wardend -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.warden/config/genesis.json https://files.shazoes.xyz/testnets/warden/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.warden/config/addrbook.json https://files.shazoes.xyz/testnets/warden/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://warden-testnet-rpc.itrocket.net"
  homeFolder=".warden"
  binaryName="wardend"
  maxPeers={25}
/>
</TabItem>
</Tabs>
