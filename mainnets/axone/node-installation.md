---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-axone">
# Axone Protocol Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `axone-1` | Node Version: `v12.0.0` | Custom Port: `304`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export AXONE_CHAIN_ID="axone-1"" >> $HOME/.bash_profile
echo "export AXONE_PORT="304"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl unzip clang pkg-config libssl-dev jq build-essential tar wget  bsdmainutils git make ncdu gcc git jq htop tmux chrony liblz4-tool fail2ban -y
```

### Install GO

```bash
cd $HOME
VER="1.23.8"
wget "https://golang.org/dl/go$VER.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$VER.linux-amd64.tar.gz"
rm "go$VER.linux-amd64.tar.gz"
[ ! -f ~/.bash_profile ] && touch ~/.bash_profile
echo "export PATH=$PATH:/usr/local/go/bin:~/go/bin" >> ~/.bash_profile
source $HOME/.bash_profile
[ ! -d ~/go/bin ] && mkdir -p ~/go/bin
go version
```

### Download and Build Binaries

```bash
cd $HOME
rm -rf axoned
git clone https://github.com/axone-protocol/axoned.git
cd axoned
git checkout v1.0.0
make install
```

### Initialize The Node

```bash
axoned init $MONIKER --chain-id $AXONE_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "axone-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30457"|' \
  $HOME/.axoned/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.axoned/config/genesis.json https://files.shazoes.xyz/mainnets/axone/genesis.json
wget -O $HOME/.axoned/config/addrbook.json https://files.shazoes.xyz/mainnets/axone/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="3e5835a2ed3161171fcd19212573b6a7f63b7752@axone-mainnet-rpc.shazoes.xyz:30456,f05efa118b4a058355019fd0a564be807cef1d33@152.53.85.0:17656,1a3f24c751b7aa5a4cd449ecea9e62208fedca74@162.55.87.26:43256,a7a78aca8704b913337c1ed2a0c76892ad3ab985@104.248.131.60:19007,a3fa14196d8cd05e16eb58e825f2b136a029e28b@65.108.45.119:38656,b9e0d01112a783907f5269517c6be488e9957166@198.96.92.242:26816,1849d58c77c446feae4bf8ad109f494dfc69a268@113.161.132.233:18656,5daeb57d78d5e28e03eab6946bcc010ba01adf47@176.9.92.135:61056,30d5123dd8b0c4b8e02b0780d58898d18a3d218d@65.108.198.145:18656,17cadb3115c706bd0338a081121c6c7252b7a5f2@65.21.237.228:26112,8e59c916d235915a19fd53a84608b5969fae1453@78.46.36.203:17656,9e250572a6a1970a916f9be762dae53e3e56bc37@65.109.18.169:20056,36e303f2c63c51ed15b662b50c651f19505a689a@135.181.5.232:17656,b3951a48d92024e1dcc5db1ec5b5452ea8cea7af@144.76.74.73:20056,b65c7e9299571dfeaeb637ea73fd12440e1b9924@65.108.201.218:17656,3331cda07af7ecdee5594b1ab56075a2081ae6d3@93.125.49.130:26659,dcc0c9c254bdb81107b61f30ddb5f9ed32f24645@168.119.143.51:18656,740741048700f4e8cc1fb6609bddc569e5b9d6d5@65.108.236.5:20056,79b76f242dc571f2808402a8674b71af614f4286@65.109.112.170:20056,17e6e445d79b608df52c36d9eae1deb32101f40f@116.202.218.189:31656,a93258bc1fee00ce378829153e69a253b49cbeb1@65.109.112.148:10096,64cabf63788b91fbbc89bea7eb46516a7ef24d14@65.109.65.210:42656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.axoned/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${AXONE_PORT}317%g;
s%:8080%:${AXONE_PORT}080%g;
s%:9090%:${AXONE_PORT}090%g;
s%:9091%:${AXONE_PORT}091%g;
s%:8545%:${AXONE_PORT}545%g;
s%:8546%:${AXONE_PORT}546%g;
s%:6065%:${AXONE_PORT}065%g" $HOME/.axoned/config/app.toml
sed -i.bak -e "s%:26658%:${AXONE_PORT}658%g;
s%:26657%:${AXONE_PORT}657%g;
s%:6060%:${AXONE_PORT}060%g;
s%:26656%:${AXONE_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${AXONE_PORT}656\"%;
s%:26660%:${AXONE_PORT}660%g" $HOME/.axoned/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.axoned/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.axoned/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.axoned/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.axoned/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.01uaxone\"/" $HOME/.axoned/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.axoned/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.axoned/config/config.toml
```

### Download Snapshot

```bash
curl https://snapshot.shazoes.xyz/mainnets/snapshot-axone.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.axoned
```

### Set Service File

```bash
sudo tee /etc/systemd/system/axoned.service > /dev/null <<EOF
[Unit]
Description=axone-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which axoned) start --home $HOME/.axoned
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable axoned && sudo systemctl start axoned && sudo journalctl -fu axoned -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/axone_auto)
```

  </TabItem>
</Tabs>
