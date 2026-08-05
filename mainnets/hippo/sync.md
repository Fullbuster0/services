---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Sync
</div>
<span className="sub-lines"> 
Chain ID: `hippo-protocol-1` | Node Version: `v1.0.2`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-hippo.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop hippod
```

### Backup priv_validator_state.json

```bash
cp $HOME/.hippo/data/priv_validator_state.json $HOME/.hippo/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
hippod tendermint unsafe-reset-all --home $HOME/.hippo --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-hippo.tar.lz4 && lz4 -c -d snapshot-hippo.tar.lz4 | tar -x -C $HOME/.hippo && rm snapshot-hippo.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.hippo/priv_validator_state.json.backup $HOME/.hippo/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop hippod
```

### Backup priv_validator_state.json

```bash
cp $HOME/.hippo/data/priv_validator_state.json $HOME/.hippo/priv_validator_state.json.backup
```

### Reset the data

```bash
hippod tendermint unsafe-reset-all --home $HOME/.hippo
```

### Add Peers

```bash
PEERS="40de6f07821a098bb2a737e0d162a91efc12635f@hippo-mainnet-rpc.shazoes.xyz:30256,d2cd19145dbb45441e07d484fbb2914474e70cec@88.198.46.77:27656,226e23feea1c36eff64b247658304cff45c775d2@75.119.156.36:10156,2e751b3c163134d0404f82a6d9f6115ea04c4da6@135.181.5.232:31856,f8a154551952162acad04ba872b11a09b5c5f568@65.108.205.121:31856,dae3fce4cdb389148ad50921beebe48309f3acb4@213.239.198.181:12656,228d018aba4fa42bf278166cf15e70b5df7fd2e6@54.180.207.159:26656,fce82e1f228cf0660f02717cb80285f42b9efef1@148.113.214.11:18900,34d206b5f8f9f37917c971561424fd40cfd44b2c@65.21.234.111:10656,8558dc25912b21ec13bc0011b2ab3adfe8e2bf40@5.9.99.42:31856,23f1a1906d4f83a01e5626d8b0f876b6a130d1de@184.107.244.74:18900,f94b1ad39835a9ce9fe9f6a83ca528d9be6ba276@149.50.101.137:12556,ea389eb3d9604da072f6f3d1253938a38715c5c5@44.226.74.246:26656,6f6a3a908634b79b6fe7c4988efec2553f188234@23.128.116.127:31856,d47230ba69c96782bb1e19ceea0c01b309bdb403@23.88.6.237:31856,637077d431f618181597706810a65c826524fd74@103.87.58.204:31856"
SNAP_RPC="https://hippo-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.hippo/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.hippo/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.hippo/priv_validator_state.json.backup $HOME/.hippo/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.hippo/config/genesis.json https://files.shazoes.xyz/mainnets/hippo/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.hippo/config/addrbook.json https://files.shazoes.xyz/mainnets/hippo/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc={[
    "https://rpc.hippo.protocol.com",
    "https://hippo-mainnet-rpc.shazoes.xyz",
    "https://rpc.hippo.nodeshub.online",
  ]}
  homeFolder=".hippo"
  binaryName="hippod"
  maxPeers={25}
/>
</TabItem>
</Tabs>
