---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-seda">
# Seda Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `seda-1` | Node Version: `v0.1.10` | Custom Port: `6`
</span>

<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SEDA_CHAIN_ID="seda-1"" >> $HOME/.bash_profile
echo "export SEDA_PORT="6"" >> $HOME/.bash_profile
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
git clone https://github.com/sedaprotocol/seda-chain.git
cd seda-chain
git checkout v0.1.10
make install
```

### Initialize The Node

```bash
sedad init $MONIKER --chain-id $SEDA_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "seda-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:6657"|' \
  $HOME/.sedad/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.sedad/config/genesis.json https://files.shazoes.xyz/mainnets/seda/genesis.json
wget -O $HOME/.sedad/config/addrbook.json https://files.shazoes.xyz/mainnets/seda/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="67b32792fdb84982b746172c3a599cda1c940247@seda-mainnet-rpc.shazoes.xyz:6656,a27fde2698f857562efcefdaf85ddd466782c78a@211.216.47.217:29656,702f09afd25bbfd21dac1ebe9a6098c6b31c72b4@65.108.98.235:24656,d9bfa29e0cf9c4ce0cc9c26d98e5d97228f93b0b@37.27.61.38:17356,9b6d05c97e7ee1d04899402b76608fb76bca7cd9@135.125.74.49:57056,6c153a3a12fd030b2d74e04f7da539b4fdd8165a@135.181.63.105:46656,4a75daf47b56decb10c858ca9524033e1a47e8ff@64.185.227.122:25856,90252c9b8c0946cd68f1aa544fa523569fdb97b3@65.109.115.172:25856,f3ca6398bd93b2c2b90b9bcc7e862a2c556b9eae@178.63.130.236:36656,1a87a68c8a03ecbf6d6e65d4ce780d72d5498c0f@65.108.71.137:25856,f6bdb78ff8c7487b9d6a1a3694ec7ecf3ddc2911@46.17.103.41:25856,8d91882539092d30091bd79d6837b6943362dcca@81.0.220.94:25856,f66b9d59461685d4687e272b03dd0f1b07036421@189.1.170.86:56176,5c66fc77b1bc1329f879ad4b12d2766a7e39ca34@23.129.20.120:25856,fe6ef8aac1b6e667b8aac2e01a659b607148d199@65.108.72.239:23656,3b620287baf6fb56342557955ff39a5d71f9fd71@38.146.3.231:25856,d8483e560bea268ddf8c1176b44571f6c09b9535@94.130.35.35:19656,1067a3d13bc82129b14078edb053be07966c15fe@113.161.132.233:13656,71620b329b80632f1b6d996c53d08c26fe8863f9@217.170.204.54:16656,e34624438ff1aaf2f0811f07c9a1aec5e205c43e@49.13.135.95:26656,44b419fd4c50d5f020d99815198fec9e0d65eeb7@46.4.23.120:17356,3a9b2d046e57d9e4194a4a2e552651bc8b732ded@46.4.29.231:3000,7c522356a7b56371d79c3b3e2e90cc0fbcabe123@65.108.99.37:44656,17fc8a4d8e5480e5626774013a40ca12edae9147@50.46.175.241:25856,1a00b931ca6ad065ebb59b4047188c35c7247e5e@37.252.186.105:3000,f9ad00c49bf013e1f36707d87702073a52875c8b@65.109.18.169:25856"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.sedad/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${SEDA_PORT}317%g;
s%:8080%:${SEDA_PORT}080%g;
s%:9090%:${SEDA_PORT}090%g;
s%:9091%:${SEDA_PORT}091%g;
s%:8545%:${SEDA_PORT}545%g;
s%:8546%:${SEDA_PORT}546%g;
s%:6065%:${SEDA_PORT}065%g" $HOME/.sedad/config/app.toml
sed -i.bak -e "s%:26658%:${SEDA_PORT}658%g;
s%:26657%:${SEDA_PORT}657%g;
s%:6060%:${SEDA_PORT}060%g;
s%:26656%:${SEDA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${SEDA_PORT}656\"%;
s%:26660%:${SEDA_PORT}660%g" $HOME/.sedad/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.sedad/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.sedad/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.sedad/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.sedad/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"10000000000aseda\"/" $HOME/.sedad/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.sedad/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.sedad/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/sedad.service > /dev/null <<EOF
[Unit]
Description=seda-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which sedad) start --home $HOME/.sedad
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable sedad && sudo systemctl start sedad && sudo journalctl -fu sedad -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/seda_auto)
```

  </TabItem>
</Tabs>
