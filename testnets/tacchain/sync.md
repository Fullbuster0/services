---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-tacchain">
# Tacchain Sync
</div>
<span className="sub-lines"> 
Chain ID: `tacchain_2391-1` | Node Version: `v0.0.11`
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
sudo systemctl stop tacchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.tacchaind/data/priv_validator_state.json $HOME/.tacchaind/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
tacchaind tendermint unsafe-reset-all --home $HOME/.tacchaind --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-tacchain.tar.lz4 && lz4 -c -d snapshot-tacchain.tar.lz4 | tar -x -C $HOME/.tacchaind && rm snapshot-tacchain.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.tacchaind/priv_validator_state.json.backup $HOME/.tacchaind/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart tacchaind && sudo journalctl -fu tacchaind -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop tacchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.tacchaind/data/priv_validator_state.json $HOME/.tacchaind/priv_validator_state.json.backup
```

### Reset the data

```bash
tacchaind tendermint unsafe-reset-all --home $HOME/.tacchaind
```

### Add Peers

```bash
PEERS="9c32b3b959a2427bd2aa064f8c9a8efebdad4c23@206.217.210.164:45130,e9c256c67608948b5449b88227de99df0e58dd38@95.217.37.107:59656,6833866cd3efef730e91e46b72e0b8e86bcecb60@95.216.147.118:26656,d0bf8edcf28dfff75d850863f3985f9448661abf@23.92.177.41:45140,974b85109fd486971e8a5a02a75ba474bc44daf2@209.222.101.91:26656,d8ae3f2ad40170a4248e5cf1b1714d214c254a17@173.212.239.147:26656,3518b6ac9a245d53dd67490225ed120e5705854f@193.34.212.80:55656,21551bc301ac6e13bdea0608d2f2a26b0d3708f4@152.53.230.81:55656,ed1d8b92a61e1d94ec8b880a2575f0f87a0350d2@149.50.116.116:59656,5eb72b9bd8ee5d79c8746084ef5b84e4c07c865b@46.4.107.23:32156,762ba69f4892769e8e282e3714b5f5f346a0f8b9@195.189.96.111:60356,143f2b46ca482470065f750c5345dc9b3f624cdd@65.21.221.110:52656,0cde2d373eecf63c9c5e00db62da6ee3661d1247@135.181.139.249:13656,ea2d65ab09e521ba6db24bc3a2350c3bd19e9d53@169.150.240.74:60356,dc34ff359d9dee20357272171523ce44055d1e0d@195.3.223.73:59656,7b4589393e08b89b24c5dc83013ca81764b30547@65.109.18.91:59656,1665f99009d4d6add70408387fb88bb765455305@167.235.178.134:32156,f908f6910acd523d98f0bdddc7fe9be2bb16e616@188.40.66.173:32156,fd50ad445fb4a472d5224f8a33b555fcb48c5f34@65.21.221.109:59656"
SNAP_RPC="https://tacchain-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.tacchaind/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.tacchaind/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.tacchaind/priv_validator_state.json.backup $HOME/.tacchaind/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart tacchaind && sudo journalctl -fu tacchaind -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.tacchaind/config/genesis.json https://files.shazoes.xyz/testnets/tacchain/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.tacchaind/config/addrbook.json https://files.shazoes.xyz/testnets/tacchain/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://tacchain-testnet-rpc.shazoes.xyz"
  homeFolder=".tacchaind"
  binaryName="tacchaind"
  maxPeers={25}
/>
</TabItem>
</Tabs>
