---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-selfchain">
# Selfchain Sync
</div>
<span className="sub-lines"> 
Chain ID: `self-1` | Node Version: `v1.0.1`
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
sudo systemctl stop selfchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.selfchain/data/priv_validator_state.json $HOME/.selfchain/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
selfchaind tendermint unsafe-reset-all --home $HOME/.selfchain --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-selfchain.tar.lz4 && lz4 -c -d snapshot-selfchain.tar.lz4 | tar -x -C $HOME/.selfchain && rm snapshot-selfchain.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.selfchain/priv_validator_state.json.backup $HOME/.selfchain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart selfchaind && sudo journalctl -fu selfchaind -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

### Stop Service

```bash
sudo systemctl stop selfchaind
```

### Backup priv_validator_state.json

```bash
cp $HOME/.selfchain/data/priv_validator_state.json $HOME/.selfchain/priv_validator_state.json.backup
```

### Reset the data

```bash
selfchaind tendermint unsafe-reset-all --home $HOME/.selfchain
```

### Add Peers

```bash
PEERS="bed9629cabe40dc42e4ce42f7385436b02ebb7c7@173.234.17.129:26656,473303f1a0dff43121cff9b7a12b5b39a42bc46c@37.27.31.253:26656,c87c1b17045b27fd14b13d7dbb3469a2248cb1f7@95.217.204.58:24356,b844793daeffaedfcdbd5b08688cd10e1859d678@37.120.245.116:26656,12ee3086924cd372f9b246f2fd62f168d8e1956f@35.246.137.252:26656,761ebdb799904dc67497dac749dffa6bf3ffb1f7@51.91.154.241:26656,790544e857cfe673cab570668131aa7ae2be7e5d@178.63.100.102:26656,6ca2f5faaac9eb9515d12e4437dda9f5b92fe75a@185.185.80.16:27656,34c3a8a2955b4d6e5deef15c6b091250f5878afe@18.117.74.150:26656,c597aa118302d417e039e5a81d722422e73c85e1@135.125.67.229:26656,b3d49f5754fef88f26d00855e7317facf4f69e83@34.107.59.232:26656,e9376f40ac2b672e9f2f66ad212f59801d53afe8@178.162.165.193:26656,637077d431f618181597706810a65c826524fd74@5.9.151.56:24356,07291598c904b1a007c95c1ad65726ec89e86957@149.50.96.153:26656,ca615e31000fa4c6d306fe3ef660a9073fd5b841@65.109.57.180:26656,3adb5b75adf8327bb95744d7af6bae500d93f0d7@37.27.58.244:33656,175adb6fbc838fbebd5b5a38c11eb0b281f0e32d@34.159.217.146:26656,9949c2ab29bad0feeab63248ba33be3c695225cd@65.109.124.52:24356,3747951f83396d549af9e6695fff78f8448f560c@5.75.179.6:11356,760e81fb4399f84bb4812910df871dda47a338fc@135.181.57.156:24356,507c41a0e7d0bb49c3fc62fa2fbc489a67686a18@156.59.230.130:26656,57e9f8a2ecc83619b894ffd5ee515c5d16c580f8@100.42.187.8:10156,ec167976c747aaa8b31a3f8fd123cb6cca1f2583@35.242.223.62:26656,4c8b8296e767cf3d67355dba98781ee0348e87ea@144.76.30.94:30056,f888b80b3400c2a9928c9f7be05214cad148b34b@18.179.157.124:26656,0bf3b065ca0c53a49e9bfed6e1a23aa8318e85da@95.217.148.179:30656,a96b7c56cb64c16917a629c9ae0f3b3c0aea584c@34.159.240.168:26656,e9f2bfbf5cddb0a792148dff3f0b3520d3c63a0f@65.109.92.241:3056,2906a1636c70ea29856f3d846a897a97c97ac86f@34.107.92.166:26656,8c748ed54d18f42ad15645f36c149ef9c00f09e3@34.89.135.59:26656,1e8aba6c7d2e33545353d073006ea9815c641158@46.4.64.123:26656,05f4912df9e18205b5707ba8e2374e6d0e9fa95a@162.55.245.254:27656,5fec0f158870a9e82e8a48fed83a78d567fb639a@167.235.12.38:22156,6a3a0db2763d8222d00af55cbbe35824a39c8292@176.9.183.45:34656,c743758973f5543578949228ff623918a4b43c54@165.232.177.11:26656,2f547f93392d7351c74a0d8cae1d44f172cf32e5@64.227.156.23:26656,61f70b8b37b9a0755b95dac7d57a8c2cc45ea4ea@65.109.78.80:24356,9d7dbaa0cb7f28ab8926c738860c18bd6d00aaaf@168.119.75.89:26656,49f5167151225c0355d1135b1856546f9276d74a@213.239.220.52:25656,1b9693077773f2f986191b44169e447e0bb56dcc@185.225.191.108:36656,9e314854602573cd87ee63c66d24326d67c8454c@65.21.198.100:12856,b307b56b94bd3a02fcad5b6904464a391e13cf48@128.199.33.181:26656,f958f4e2d1384514ed8c62b1bc753d0b8a8d0430@167.235.102.45:24656,9512a59cf93b987aff830148421a514cacb8a1b8@170.64.141.15:26656,6ae10267d8581414b37553655be22297b2f92087@174.138.25.159:26656,7bad33a03bec7c0bd174a386045d5ff583b39570@95.216.7.84:36656,8b550eaf0d044d5234c1b78d0e7cbe6dbe7933e1@198.7.123.210:11356,cf97538e0ba73bff425d48251dbcdc88634d995f@65.108.193.26:20656,597482f116437fef43d401de88df976e53056511@51.77.54.5:26696,4fe1c6741fa525a7462375025aeef42039246cc1@35.246.171.68:26656,eeb793482d2957e760b65c37978ad5ba3528bbd9@65.108.66.174:41656,98b377f4ddc9031ced40cf7685e6ac4ac1f95dae@142.132.248.214:26656,7efdc46e50e03e1f1208c8f276047b7fea345cc8@35.246.252.172:26656,7a9038d1efd34c7f3baea17d8822262a981568b1@217.182.136.79:30156,c139f537755d5614a3ceaeb0f01b03be94e7ecb5@162.19.171.121:26656,c148030a2effe2cfd01e57090647ac5935f4398f@23.105.164.129:26656,0a67ac1518c816e1927554dfc17c47f4ee457bcb@168.119.75.88:36656,5394c55f1bad5cf011d0f43901cc9ad2a1a727e7@95.217.128.197:26656,5bfe7ec3ce0fbbf6d724dc85edef31c23b0a5e5e@94.130.138.48:41656,7f75c0e8a7f5f60b587f4acd805f871445367b4b@37.27.129.24:11656,52130bea53e3286292fcbf6753f6f57f3b40e138@65.108.232.168:12656,923758c6f7adaec3c9a668dc74ba28fda7066b1c@65.109.120.211:24656,bbfa092023e4fbe6b90abe19449bce3cc1c83594@113.176.163.161:26656,08bc9afd0cac4ae6cf8f1877920b0cc7e58a6f42@65.109.99.157:40009"
SNAP_RPC="https://selfchaind-mainnet-rpc.shazoes.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.selfchain/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.selfchain/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.selfchain/priv_validator_state.json.backup $HOME/.selfchain/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart selfchaind && sudo journalctl -fu selfchaind -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.selfchain/config/genesis.json https://files.shazoes.xyz/mainnets/selfchain/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.selfchain/config/addrbook.json https://files.shazoes.xyz/mainnets/selftchain/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://rpc.selfchain.io:26657"
  homeFolder=".selfchain"
  binaryName="selfchaind"
  maxPeers={25}
/>
</TabItem>
</Tabs>
