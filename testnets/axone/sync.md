---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-axone">
# Axone Sync
</div>
<span className="sub-lines"> 
Chain ID: `axone-dentrite-1` | Node Version: `v10.0.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-axone.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop axoned
```

### Backup priv_validator_state.json

```bash
cp $HOME/.axoned/data/priv_validator_state.json $HOME/.axoned/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
axoned tendermint unsafe-reset-all --home $HOME/.axoned --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-axone.tar.lz4 && lz4 -c -d snapshot-axone.tar.lz4 | tar -x -C $HOME/.axoned && rm snapshot-axone.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.axoned/priv_validator_state.json.backup $HOME/.axoned/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart axoned && sudo journalctl -fu axoned -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop axoned
```

### Backup priv_validator_state.json

```bash
cp $HOME/.axoned/data/priv_validator_state.json $HOME/.axoned/priv_validator_state.json.backup
```

### Reset the data

```bash
axoned tendermint unsafe-reset-all --home $HOME/.axoned
```

### Add Peers

```bash
PEERS="548f1a6f8b39d4c2c051e86f03652c71e41c2db1@axone-testnet-rpc.shazoes.xyz:44656,cc0f33ddf3f4e739debf4160aa33e47574257a21@45.159.223.115:27656,4e6133824966c300cf2412b792648f54f7b4eb7d@37.252.186.233:26656,ab93659fbefaa8e5ede54b1abeaa747682aba59e@74.208.16.201:26646,adb5e004b95e6db7041e68af878cf8b8bada0ec3@141.94.143.203:55156,8ea05a621d5fdfbda4192ae8369f289ef04c04ba@78.46.74.23:25656,6e4f7d05d9bfec461eaaf10bc10983759078389f@95.217.200.98:20056,5b0dc6e6a44b60756765d78fa9ad950d50db0b96@65.109.118.169:36656,910e678dbd20955652b8a2942fd173e54d9e95c1@65.21.233.188:17656,c27e8cb52aa588431e39f5c8b32c30850a228b8b@5.9.116.21:20056,65c16104e3ec43cd8996d98f0aa95be3e186373d@65.108.198.145:59656"
SNAP_RPC="https://axone-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.axoned/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.axoned/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.axoned/priv_validator_state.json.backup $HOME/.axoned/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart axoned && sudo journalctl -fu axoned -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.axoned/config/genesis.json https://files.shazoes.xyz/testnets/axone/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.axoned/config/addrbook.json https://files.shazoes.xyz/testnets/axone/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://axone-testnet-rpc.shazoes.xyz"
  homeFolder=".axoned"
  binaryName="axoned"
  maxPeers={25}
/>
</TabItem>
</Tabs>
