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
Chain ID: `seda-1` | Node Version: `v0.1.10`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/mainnets/metadata-seda.json"
/>

### Install Dependencies

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
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/mainnets/snapshot-seda.tar.lz4 && lz4 -c -d snapshot-seda.tar.lz4 | tar -x -C $HOME/.sedad && rm snapshot-seda.tar.lz4
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
PEERS="02ed3aef42c9a6cb32fbea3fe3d117ab3ef8a920@64.185.226.202:25856,6c153a3a12fd030b2d74e04f7da539b4fdd8165a@135.181.63.105:46656,00d1cd510431559e0bd1daf5fc6ecce2f93802d9@130.193.42.24:26656,90252c9b8c0946cd68f1aa544fa523569fdb97b3@65.109.115.172:25856,71620b329b80632f1b6d996c53d08c26fe8863f9@217.170.204.54:16656,78d052e44bd44ee4f019825d7bc1271f048e9111@94.130.77.170:26656,3a9b2d046e57d9e4194a4a2e552651bc8b732ded@46.4.29.231:3000,a3fbd8291f7d6a2170f7b1a0e10542b809fd43a1@195.201.106.166:25856,3f33590cd6536b3b336120df6e642a1801777b10@49.13.127.180:26656,d60b25fe2c523893a739b81dca99b2ecf571c8d8@65.108.101.109:25856,8d887e7007696439a955e839d786532af746f697@94.130.13.186:25856,2cb792992a85a590359a6edfdca62bbd555d8585@89.58.41.234:26656,86aefda8df2348b45e417ef8a295dc2a254fc96d@77.68.126.116:26656,8d91882539092d30091bd79d6837b6943362dcca@81.0.220.94:25856,7de3ade8a9bd79e0d1c2949f6643b14764fb1fe9@5.189.136.5:26656,7db12071c76c4722bf4184cdf4349bb15200dd30@185.119.116.241:26656,54ad1b2d8f97897f63238955530aadd3349f0605@185.182.194.239:26656,a27fde2698f857562efcefdaf85ddd466782c78a@211.216.47.217:29656,9b6d05c97e7ee1d04899402b76608fb76bca7cd9@135.125.74.49:57056,f8846039206179880bdcaf371aa295f44f2af975@95.217.39.34:25856,4aba7b5760bfbf4c56bc28ba56d3a830656a5166@65.109.112.170:17356,d81b682c58bcff94d142db931046234e99f878ca@162.19.169.74:46656,81c9d8a048df99c29af03b9971e230bdd6995726@162.19.83.215:57056,4a75daf47b56decb10c858ca9524033e1a47e8ff@64.185.227.122:25856,9eb343010b328fab1f955f5e18f62032a23afa50@152.53.19.64:20656,892777ce97dfc69c54dc1540a7ccfbf09ff2ff12@208.91.107.232:25856,f66b9d59461685d4687e272b03dd0f1b07036421@189.1.170.86:56176,5c66fc77b1bc1329f879ad4b12d2766a7e39ca34@23.129.20.120:25856,47a3c94d0bb74476b9befa551a9b4fd67269229a@64.38.176.74:26656,f482ca37b63e53c06bb267cbb0f594d9560234bb@88.99.68.249:25856,a882f636076c6bcea8ed7346c6f1bd8a332dfe35@20.150.223.91:26656,7c522356a7b56371d79c3b3e2e90cc0fbcabe123@65.108.99.37:44656,f3ca6398bd93b2c2b90b9bcc7e862a2c556b9eae@178.63.130.236:36656,1a00b931ca6ad065ebb59b4047188c35c7247e5e@37.252.186.105:3000,fa4806e7a75a24a9c7c65cca3293798de36b7ca7@135.125.188.14:26656,737559f20420bb90c174485ecd76292512746c4a@65.109.108.47:25856,858c4a3844000e3ffda9bd73e78a14df43f4c3d9@164.68.107.103:17356,ea602e6d2abaab4a4ec786c744fff389e9da4dc2@135.181.178.120:10656,1a87a68c8a03ecbf6d6e65d4ce780d72d5498c0f@65.108.71.137:25856,f6bdb78ff8c7487b9d6a1a3694ec7ecf3ddc2911@46.17.103.41:25856,58c919e7b89b8c5b5a3024f5e7cec07d2e3b28d3@78.47.163.48:26656,d8483e560bea268ddf8c1176b44571f6c09b9535@94.130.35.35:19656,702f09afd25bbfd21dac1ebe9a6098c6b31c72b4@65.108.98.235:24656,1067a3d13bc82129b14078edb053be07966c15fe@113.161.132.233:13656,baf60d1f52ebb3cf0da76ee66e5d4eb8c30f11c9@207.244.254.110:31656,02cadb2a0ab4599ce311da557509461e56702e17@95.217.210.43:26656,3b620287baf6fb56342557955ff39a5d71f9fd71@38.146.3.231:25856,44b419fd4c50d5f020d99815198fec9e0d65eeb7@46.4.23.120:17356,fe6ef8aac1b6e667b8aac2e01a659b607148d199@65.108.72.239:23656"
SNAP_RPC="https://seda-mainnet-rpc.shazoes.xyz:443"
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
wget -O $HOME/.sedad/config/genesis.json https://files.shazoes.xyz/mainnets/seda/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.sedad/config/addrbook.json https://files.shazoes.xyz/mainnets/seda/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc="https://seda-mainnet-rpc.shazoes.xyz"
  homeFolder=".sedad"
  binaryName="sedad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
