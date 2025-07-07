---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-cardchain">
# Cardchain Sync
</div>
<span className="sub-lines"> 
Chain ID: `cardtestnet-12` | Node Version: `v0.16.0`
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
sudo systemctl stop Cardchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.cardchaind/data/priv_validator_state.json $HOME/.cardchaind/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
Cardchaind tendermint unsafe-reset-all --home $HOME/.cardchaind --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-cardchain.tar.lz4 && lz4 -c -d snapshot-cardchain.tar.lz4 | tar -x -C $HOME/.junction && rm snapshot-cardchain.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.cardchaind/priv_validator_state.json.backup $HOME/.cardchaind/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart Cardchaind && sudo journalctl -fu Cardchaind -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop Cardchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.cardchaind/data/priv_validator_state.json $HOME/.cardchaind/priv_validator_state.json.backup
```

### Reset the data

```bash
Cardchaind tendermint unsafe-reset-all --home $HOME/.cardchaind
```

### Add Peers

```bash
PEERS="a615a4f29b48a737ceb473638876df7420847f25@82.146.33.77:26656,8fac860cb5ed5067cdf3943689a8c3964eadd262@207.244.253.244:39656,b32cf40549b67f7366e91df670e5cbae0eb5a9b5@65.109.36.232:12456,050324f017639e5faf213ec85ec26c7fa104da3f@157.90.226.221:31656,8861ab5e6421ab94efd5b1d8dcb11d344ee9bb58@75.119.134.140:21656,443c0471d3bb10717c8e0df5b0171c87c1d6ed9d@142.132.152.46:22656,d8babb0317250c3291e646efde372025efee6178@5.78.107.235:26656,d0bb15daba08a7c84c45d8ee48daeadf42d08a6a@185.144.99.114:26656,2a0fb04657337a73df70e586b5091a813ec0a2c3@167.235.155.8:26656,35c8779026ceb17659b722b6a768e5a7f070c770@84.247.161.158:31656,742d3fa2aa65368d859f3893fee05ecb92e8f995@65.108.227.112:26656,009ee7e4ed7a58fb49fd760df8e99069b3958e3a@95.217.148.179:37656,45b4cf1467146c673dad0455b506f88827b2eaba@65.109.93.58:35656,ab2ad2744f3b193f72cb4fd42465155bfca0ccb4@65.109.57.180:13256,b41f7ce40c863ee7e20801e6cd3a97237a79114a@65.21.53.39:16656,947aa14a9e6722df948d46b9e3ff24dd72920257@65.108.231.124:31656,18f51e123d595868d97e701bb37ca862841571ce@65.108.237.231:56108,263bea65bcf39d1244d0d251b2f089c0b5c56a13@144.76.97.251:38656,e6e2fac705b824cbd6b929fb06005c499b408a02@113.176.163.161:26656"
SNAP_RPC="https://cardchain-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.cardchaind/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.cardchaind/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.cardchaind/priv_validator_state.json.backup $HOME/.cardchaind/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart Cardchaind && sudo journalctl -fu Cardchaind -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.cardchaind/config/genesis.json https://files.shazoes.xyz/testnets/cardchain/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.cardchaind/config/addrbook.json https://files.shazoes.xyz/testnets/cardchain/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://cardchain-testnet-rpc.itrocket.net"
  homeFolder=".cardchaind"
  binaryName="Cardchaind"
  maxPeers={25}
/>
</TabItem>
</Tabs>
