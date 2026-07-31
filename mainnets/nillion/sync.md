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

<div className="h1-with-icon icon-nillion">
# Nillion Sync
</div>
<span className="sub-lines"> 
Chain ID: `nillion-1` | Node Version: `v0.2.5`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-nillion.json"
/>

### Install Dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop nilchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.nillionapp/data/priv_validator_state.json $HOME/.nillionapp/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
nilchaind tendermint unsafe-reset-all --home $HOME/.nillionapp --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-nillion.tar.lz4 && lz4 -c -d snapshot-nillion.tar.lz4 | tar -x -C $HOME/.nillionapp && rm snapshot-nillion.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.nillionapp/priv_validator_state.json.backup $HOME/.nillionapp/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart nilchaind && sudo journalctl -fu nilchaind -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop nilchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.nillionapp/data/priv_validator_state.json $HOME/.nillionapp/priv_validator_state.json.backup
```

### Reset the data

```bash
nilchaind tendermint unsafe-reset-all --home $HOME/.nillionapp
```

### Add Peers

```bash
PEERS="cffbd9a931fe474306f210f6b322ab5204d2879d@nillion-mainnet-rpc.shazoes.xyz:30856,bc13626f878d7b83f18628e1489aa69bc05825e2@37.27.127.137:26666,a1589d0253a2857bf6bef6aa4337956fb0bffe6b@65.108.205.121:28156,c123d1d97a4a81e11900e973230c7c3820e36b67@65.109.61.79:28156,c4c6730d6d068f0baae7f71d05405f886cb16596@65.108.77.220:5000,43507292d8a3fe04c4cd5ab063b676c6ef9ad3d5@57.128.74.22:56316,ccf803ae7401f9beca4c86ed42466d531e1d7eb3@185.100.10.141:31321,9da9bd9147db409d1e3c080379d09753c7cc8889@35.214.131.222:26656,51c6eb79186243a86249cf1370b3a96ece54bbff@195.201.202.39:26656,74d07f74ea324c83661fb01874c34914a918ad53@149.50.110.216:26656,28e36e25966cac6ce9d7d9ccc52afb86d44470f6@84.32.32.150:18600,275ff616339bc7a5f242ff63f1d5bdc4061d7828@15.204.96.26:26656,b4a0753efffc6c7704f1f5d22047d5463776ab4f@121.134.209.209:26656,f55f7eb02fa05a02cc4186b028a05a2dc7b71d9d@184.107.185.205:18600,0e5e4dae6f359062d7bd953ecd84d157aa1e271a@185.189.44.205:26656,a8038f2de293de4f28797e1e069bbed858dfb9c6@45.250.252.75:56316,e6af840bddfe0ab8986f40f8e55a3fad5b21eeae@95.217.150.48:28156,cceb2b5e71e0452bca1e3988730ab7262401d158@162.19.97.197:56316,4e2240e775069d7116053fde46c0f8ccd20775db@167.235.22.239:26673,8914b1372a2f7e1b6a1fb0c7c37d6313b78deca9@91.99.129.0:26656,db3660c0a82f8d23b567aa0c8c516042fe25300a@173.231.41.34:26651,b7e7b55f5054455bb023f7caeb88f8e2f442413b@135.181.249.230:26656,4e4bb63259ace50da09443462d14c053f8d3eb0b@78.46.50.53:26673,78e46394365eb9a9e3f42cbfd324015a0f1f6a48@65.21.16.240:28156,499c9a2c3f3f00300db47599ecdbd8d339acc02d@65.21.214.84:28156,4c129f6b8517ed1c7d6d3e7f9e6bc361445120d0@157.180.4.96:56316,81b7fec7f601dbc291513c3c6b71de9f01dc4596@37.27.229.233:26656,c1b30cda900af8ecf94bc4aad16d49a8738b7cc5@135.125.189.222:26656,e6c00ac958e85bb7844ca0afc2d6cba300f599b0@37.187.136.121:18056"
SNAP_RPC="https://nillion-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.nillionapp/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.nillionapp/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.nillionapp/priv_validator_state.json.backup $HOME/.nillionapp/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart nilchaind && sudo journalctl -fu nilchaind -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.nillionapp/config/genesis.json https://files.shazoes.xyz/mainnets/nillion/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.nillionapp/config/addrbook.json https://files.shazoes.xyz/mainnets/nillion/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://nillion-mainnet-rpc.shazoes.xyz"
  homeFolder=".nillionapp"
  binaryName="nilchaind"
  maxPeers={25}
/>
</TabItem>
</Tabs>
