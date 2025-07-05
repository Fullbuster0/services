---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-seda">
# Seda Sync
</div>
<span className="sub-lines"> 
Chain ID: `seda-1-testnet` | Node Version: `v1.0.0-rc.4`
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
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnet/snapshot-seda.tar.lz4 && lz4 -c -d snapshot-seda.tar.lz4 | tar -x -C $HOME/.sedad && rm snapshot-seda.tar.lz4
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
PEERS="d967e409d7353994e43fd5c13191f4c99673d297@5.9.116.21:25856,d84359abdb55f6f7b1caf59c80855955f44bf32b@94.130.35.35:13656,50d00c212df119eb19ab976b40cf3cd149ad50ab@185.183.35.185:26656,a6a6f924bf8a88e2d2d6ace0031e6844951712a9@93.189.30.113:26656,cb75c263cff51a14a4f10694046bb81414d10064@18.171.36.35:26656,e5af5f5c2650fb13da1c661460e72186face79be@95.217.35.179:25856,1c3e338b82bc8ca81e7625609e9f8ef583963143@65.108.105.48:25856,35d1fec5d70b51e90dfa8b5a2368691ebc78b82a@57.128.202.24:26656,945710d8ab3b3c5e4f9474254213bccf09551878@91.223.3.190:56176,1fef9721db7cb37ace237d1a2b1271c319bb1c0c@94.130.164.82:25856,b2693b557e75822c4d02b7344a2d38781ffed780@194.163.135.92:26656,e25298af7d8884992ab5ae14d0d4e1368bee799f@131.153.154.57:26656,c13a5b542acb9af74c866f512eb0b6c88add8134@176.9.0.179:26656,d5519e378247dfb61dfe90652d1fe3e2b3005a5b@65.109.68.190:17356,1027c297a88a37b67906c85099116b8fe0136b0e@135.181.178.120:17656,8cfdbb242658a42a108b64bbdff73216df9a8e7d@51.195.61.9:25856"
SNAP_RPC="https://seda-testnet-rpc.shazoes.xyz:443"
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
wget -O $HOME/.sedad/config/genesis.json https://files.shazoes.xyz/testnets/seda/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.sedad/config/addrbook.json https://files.shazoes.xyz/testnets/seda/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://seda-testnet-rpc.shazoes.xyz"
  homeFolder=".sedad"
  binaryName="sedad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
