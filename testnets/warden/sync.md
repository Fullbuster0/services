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
Chain ID: `chiado_10010-1` | Node Version: `v0.6.2`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

### Install dependencies

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
PEERS="41a3a66993696c5e5d44945de2036227a4578fb3@195.201.241.107:56296,e9f4e2eaee32852dda0488db591c01b40b9c73aa@195.3.223.78:11956,0fb6439f5e2cfc8622501769bb071076bce9dfc1@116.202.150.231:18656,d5c6b1d38c4b8d0a0189f419d9c014c491970e89@38.242.146.0:22656,2f99ac7e72cc8c1f951e027d6088b8a920163237@65.109.111.234:18656,77451ec9ae8d5536704aadfec1f7e07cd41f29ac@135.181.191.99:37656,26943d39c1a2c39b87d14cafaad1c323e1960291@65.109.84.33:27356,a159f729d8adda00013c157a18ba76bd0af1a64b@159.69.74.237:38736,0aa24924ac019823588aa5731a485e0bfe246162@188.165.228.73:26656,33c8a7ba4b53ee5cb8f9bed304a91d576e63136c@94.16.115.147:18656,1b364274f2327ff55c1e5a11566b4e9789dcef82@94.130.143.122:30656,2d2c7af1c2d28408f437aef3d034087f40b85401@52.51.132.79:26656,9f5c904293c1c98821606b0dc2fd22d6c874cf8e@65.108.199.62:18656,129b6bc5c1367bafda1cad393005fb31c3636f1a@31.220.84.185:26656,e2345cb48f03169d541df2cb8886c175d927d166@65.109.27.148:18656,31564e70d691c7622e48533c2a9892172a47655a@82.197.68.45:26656,de9e8c44039e240ff31cbf976a0d4d673d4e4734@188.165.213.192:26656,d8d46d0175fe948529aa52d696e2fcf50691c492@162.55.97.180:15656,adc3ce9502f19fb585a807e45541bf4bc8172519@185.230.138.142:50656,fe0f59a648d737af1632a5577d30c62717aa82fa@135.181.236.254:37656"
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
