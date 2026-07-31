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
  <span className="notice-text">Network no longer actively validated · Services docs only (no updated)</span>
</div>

<div className="h1-with-icon icon-structs">
# Structs Sync
</div>
<span className="sub-lines"> 
Chain ID: `structstestnet-101` | Node Version: `v0.6.0-beta`
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
sudo systemctl stop structsd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.structs/data/priv_validator_state.json $HOME/.structs/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
structsd tendermint unsafe-reset-all --home $HOME/.structs --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-structs.tar.lz4 && lz4 -c -d snapshot-structs.tar.lz4 | tar -x -C $HOME/.structs && rm snapshot-structs.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.structs/priv_validator_state.json.backup $HOME/.structs/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart structsd && sudo journalctl -fu structsd -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop structsd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.structs/data/priv_validator_state.json $HOME/.structs/priv_validator_state.json.backup
```

### Reset the data

```bash
structsd tendermint unsafe-reset-all --home $HOME/.structs
```

### Add Peers

```bash
PEERS="a32e2f9d8ec4bd56a1caed03a2fa8bbadbe75995@95.217.89.100:14456,3fba9d1c730954bd02edd712de244f2e97e5e13c@88.99.61.53:32656,fd3cc5f0769dea1b520c3d3eea230a2f196c5693@144.76.92.22:10656,f9ff152e331904924c26a4f8b1f46e859d574342@155.138.142.145:26656,197cfbe9f1c7bb8446a9e217d6e3710014bdc496@95.111.248.136:26656,372e686bc84528d9beccf15429f94846cd0f54d8@159.69.193.68:11656,8450315267be7073317c52432a1a8f7a94e039b8@192.155.91.61:26656,9b5164e4ae58f1a5e8f7a8681216dc79cf111aef@188.165.226.46:26696,09e8f5be4c58c0a8ddf5596742a2322431523f2f@216.128.181.240:26656,4d6a8ba29019e2af39910edad5665d8d91d46dde@65.21.32.216:60856"
SNAP_RPC="https://structs-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.structs/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.structs/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.structs/priv_validator_state.json.backup $HOME/.structs/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart structsd && sudo journalctl -fu structsd -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.structs/config/genesis.json https://files.shazoes.xyz/testnets/structs/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.structs/config/addrbook.json https://files.shazoes.xyz/testnets/structs/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://structs-testnet-rpc.shazoes.xyz"
  homeFolder=".structs"
  binaryName="structsd"
  maxPeers={25}
/>
</TabItem>
</Tabs>
