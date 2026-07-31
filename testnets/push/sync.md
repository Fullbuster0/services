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

<div className="h1-with-icon icon-pushchain">
# Push Sync
</div>
<span className="sub-lines"> 
Chain ID: `push_42101-1` | Node Version: `v0.0.15`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-pushchain.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop pchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.pchain/data/priv_validator_state.json $HOME/.pchain/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
pchaind tendermint unsafe-reset-all --home $HOME/.pchain --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-pushchain.tar.lz4 && lz4 -c -d snapshot-pushchain.tar.lz4 | tar -x -C $HOME/.pchain && rm snapshot-pushchain.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.pchain/priv_validator_state.json.backup $HOME/.pchain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart pchaind && sudo journalctl -fu pchaind -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop pchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.pchain/data/priv_validator_state.json $HOME/.pchain/priv_validator_state.json.backup
```

### Reset the data

```bash
pchaind tendermint unsafe-reset-all --home $HOME/.pchain
```

### Add Peers

```bash
PEERS="f473ea27e97632907fcab6c6a18ccd4ae3d1f0e0@pushchain-testnet-rpc.shazoes.xyz:44656,7006c65ce5a31b6b24a7192953f51b362350b75b@100.42.180.139:26656,091f9702302427c6b2cc5eb1d5322c1b2e4eb412@152.53.138.4:17656,628fdc3d47beb47fcc5da58746da7a3a7e26330f@154.12.118.238:26656,deda68a955b352bb201ab54422de1ab35db46652@136.113.195.0:26656,d7fe39a89a2ab1d9a8207121c6a1f8e11f79ac97@34.9.151.27:26656,d2a1f2a83858d483ed05c5f094a65d1dd463de78@34.57.236.39:26656,6531c80081c30afe3c4adb57c57721d16a3a405c@148.113.178.57:26656,6751a6539368608a65512d1a4b7ede4a9cd5004f@136.112.142.137:26656,fab943f24e42949c021c8bfd6da2bfd13fce5a38@34.61.62.242:26656,374573900e4365bea5d946dd69c7343e56e4f375@34.72.243.200:26656"
SNAP_RPC="https://pushchain-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.pchain/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.pchain/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.pchain/priv_validator_state.json.backup $HOME/.pchain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart pchaind && sudo journalctl -fu pchaind -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.pchain/config/genesis.json https://files.shazoes.xyz/testnets/pushchain/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.pchain/config/addrbook.json https://files.shazoes.xyz/testnets/pushchain/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://pushchain-testnet-rpc.shazoes.xyz"
  homeFolder=".pchain"
  binaryName="pchaind"
  maxPeers={25}
/>
</TabItem>
</Tabs>
