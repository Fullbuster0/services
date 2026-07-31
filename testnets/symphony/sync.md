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

<div className="h1-with-icon icon-symphony">
# Symphony Sync
</div>
<span className="sub-lines"> 
Chain ID: `symphony-testnet-4` | Node Version: `v5testnet`
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
sudo systemctl stop symphonyd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.symphonyd/data/priv_validator_state.json $HOME/.symphonyd/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
symphonyd tendermint unsafe-reset-all --home $HOME/.symphonyd --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnets/snapshot-symphony.tar.lz4 && lz4 -c -d snapshot-symphony.tar.lz4 | tar -x -C $HOME/.symphonyd && rm snapshot-symphony.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.symphonyd/priv_validator_state.json.backup $HOME/.symphonyd/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart symphonyd && sudo journalctl -fu symphonyd -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop symphonyd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.symphonyd/data/priv_validator_state.json $HOME/.symphonyd/priv_validator_state.json.backup
```

### Reset the data

```bash
symphonyd tendermint unsafe-reset-all --home $HOME/.symphonyd
```

### Add Peers

```bash
PEERS="4a92ad0f35afdb1df34bca49d2f21ca76f44edcd@65.21.67.40:31656,02108317e4a4878148735210721a64f89b147350@65.21.196.57:35656,d6a780caa80c783ae21c2ade96e1911c40383587@185.232.70.33:16656,bb07306c8861a418a2f4048cb1101e7a3a30e55c@176.9.113.61:36656,0654e74ef51697b400ceff9a16af9e15bfe42a72@46.4.91.76:29256,f21a0c449aa40052ab7780b073b1ecd387614eb9@65.108.129.49:38656,61771badcaff0ec79f16209a4a03a60fd6739dca@91.227.33.18:20656,ccbeb8d2f5a9b4a2d9b9da1b90ef9c85ba1d6b79@38.97.60.3:23656,12174ce319b00e579d4eb468cbb4d22bc1bd2325@65.109.117.113:29256,5f54b4547e9e3d67d039035716f2b782aa4044bf@65.109.83.40:29256,930848a35a0a5cb09948e278a2725202b689972e@116.202.150.231:12156,ce805612828bc6467fe6081c75bba1a917dc3106@109.123.247.208:35656,662e5d18365ff192c15a0a2562c1f5c0d7f5c589@65.109.30.35:35656,06655689b061c8dd02dbc7e879720cf55d36f770@65.21.141.250:35656,7c7510f57c86c038caa8b0105b5e2ae61877aa39@88.198.5.77:39656,b8d7d41577ccc95a2ec021af0535bdbbf92e4896@149.50.116.91:35656,683d80f56e9aad9caae030c218309b2e2cc15b7f@185.227.135.165:26656,b0d642c26f5d146020e91a8b41a5f55c121bcafc@149.50.116.116:31656,c4b1d93bcbdad1dd391d33e29dbcb879cdcf41d4@135.181.228.89:35656,ef8220abe47df52891b01758fd74645dc0a0bb83@116.202.32.209:26656,f5106a86b004fd48cd962a57659446ac80be9bf1@65.109.123.185:35656,673dcb5c91dc508d260f30f9eec167c8cb0e9118@195.3.223.119:27656,3b068f0a8e1065de9cbb8ce7eaefed9db4585d55@142.132.209.118:21656,60015d3ddd3bda98569121e7c02b8148ef8bb672@144.217.68.182:14556,d30babe97cbff419ad9a913744f92591c1ceeff0@45.140.146.212:26656,6ec88d52db29d6c64cbbebebd41a381245e4730f@65.108.199.62:12156,fb7df1cf347d45bd14d89ee549aa9f0c1291d3c7@152.53.84.199:35656,1fac066a1751be7c6c8141f897c67f319b3fcae2@74.241.130.41:31056,8e5d8b822c67b9e60f884857c2b58af95e1c67be@152.53.19.64:14656,d12d329f478f5172abf47bef3c8829cd776567dd@65.109.27.148:35656,897e128f19a8d0c10de7c5efc9086e1ed60b086b@135.181.0.97:35656,41d1a5b74970c1823cb1a3be3367ce5cdbe76e4e@135.181.210.46:51656,8713c8dd97c45d4d6c069c76d99ea0f64a8f3752@65.109.154.9:29156,a8dd994eea42c0cd9452e74f492e7fe8e5493dd2@195.201.194.231:26656,6baaa9a3775a97a06e160f2ecc7cc9db38f31bf8@152.53.229.82:26656,bd980568469c8c0e8c5fd0f8adcbbbe94ddd041a@135.181.79.242:35656,dd96b135e54de85ccdca1cdcb644bcd828ece8d5@167.114.118.199:26656,1267e57e1f5ce4a6688d703f02fc5f59b7717570@157.245.136.18:26656,64eba2ad436e933b0fff5d758320096904b042b6@103.129.172.245:51556,3bad680d3eebdf0e9168ad5802e2611c95eab124@195.201.197.246:27656,ec008baba8af10eb5c33b8787302e1e513c74f62@14.167.155.152:20656,df754507ff1b7d906647754c40e808d4bfbcce39@88.99.149.170:21656,ea6ca01e0d272d5f7c88a071cf74c61e7c8eafca@152.53.1.122:26656"
SNAP_RPC="https://symphony-testnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.symphonyd/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.symphonyd/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.symphonyd/priv_validator_state.json.backup $HOME/.symphonyd/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart symphonyd && sudo journalctl -fu symphonyd -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.symphonyd/config/genesis.json https://files.shazoes.xyz/testnets/symphony/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.symphonyd/config/addrbook.json https://files.shazoes.xyz/testnets/symphony/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://symphony-testnet-rpc.shazoes.xyz"
  homeFolder=".symphonyd"
  binaryName="symphonyd"
  maxPeers={25}
/>
</TabItem>
</Tabs>
