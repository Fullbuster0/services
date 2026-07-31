---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="archived-notice-banner">
  <span className="badge-archive">ARCHIVE</span>
  <span className="notice-text">Network no longer actively validated · Services docs only</span>
</div>

<div className="h1-with-icon icon-provenance">
# Provenance Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `pio-mainnet-1` | Node Version: `v1.25.0` | Custom Port: `13`
</span>

<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export PROVENANCE_CHAIN_ID="pio-mainnet-1"" >> $HOME/.bash_profile
echo "export PROVENANCE_PORT="13"" >> $HOME/.bash_profile
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
rm -rf bin
wget https://github.com/provenance-io/provenance/releases/download/v1.25.0/provenance-linux-amd64-v1.25.0.zip
unzip provenance-linux-amd64-v1.25.0.zip
chmod +x $HOME/bin/provenanced
rm provenance-linux-amd64-v1.25.0.zip
mv $HOME/bin/provenanced $HOME/go/bin/
sudo cp $HOME/bin/libwasmvm.x86_64.so /usr/lib/
sudo ldconfig
export PIO_HOME=$HOME/.provenanced
```

### Initialize The Node

```bash
provenanced init $MONIKER --chain-id $PROVENANCE_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "pio-mainnet-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:13657"|' \
  $HOME/.provenanced/config/client.toml
sed -i -e 's/namespace = "cometbft"/namespace = "provenance"/' $HOME/.provenanced/config/config.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.provenanced/config/genesis.json https://files.shazoes.xyz/mainnets/provenance/genesis.json
wget -O $HOME/.provenanced/config/addrbook.json https://files.shazoes.xyz/mainnets/provenance/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="950df6e6e1a89b6911c9477841e899df177909ac@provenance-mainnet-rpc.shazoes.xyz:13656,a72ff39dc56aa631a75f40a3b66b59602c330a91@57.129.2.102:26656,93b2dbf54d15b838c6248e9973e2c8ee6594aed0@104.196.147.17:26656,609abe51851eb5cd58721ffa7d4aa492d92305c3@34.148.50.57:26656,f56b4ef21f6d59c86d54df8616223ddac64a5215@35.229.62.62:26656,13250735ef27abf0baedab0d2c8d326da6a3d755@34.139.230.6:26656,5fe111a2972c807a51a6d80ce1de10506407b26c@34.74.211.28:26656,1778f930bfb86487b4a6f49d26ef770f4127aaed@provenance.rpc.m.anode.team:29656,8d01c48c99a5427d40912d900f14650c83d0bedd@65.108.120.161:40656,1778f930bfb86487b4a6f49d26ef770f4127aaed@65.21.224.150:29656,026e5ea19bc6aa5c67fe62f5f30f417929433b93@207.121.13.108:56656,014e0a38657e9b5fa7abbac3f597c2bd0381a55a@provenance-mainnet-rpc.itrocket.net:57656,014e0a38657e9b5fa7abbac3f597c2bd0381a55a@65.109.30.26:57656,885214c1af1aecaa58b0513e98cc7a9a377f140d@45.140.42.43:26656,30973174fa34714da38bda961bea24a49f84b15c@provenance-rpc.highstakes.ch:26657"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.provenanced/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${PROVENANCE_PORT}317%g;
s%:8080%:${PROVENANCE_PORT}080%g;
s%:9090%:${PROVENANCE_PORT}090%g;
s%:9091%:${PROVENANCE_PORT}091%g;
s%:8545%:${PROVENANCE_PORT}545%g;
s%:8546%:${PROVENANCE_PORT}546%g;
s%:6065%:${PROVENANCE_PORT}065%g" $HOME/.provenanced/config/app.toml
sed -i.bak -e "s%:26658%:${PROVENANCE_PORT}658%g;
s%:26657%:${PROVENANCE_PORT}657%g;
s%:6060%:${PROVENANCE_PORT}060%g;
s%:26656%:${PROVENANCE_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${PROVENANCE_PORT}656\"%;
s%:26660%:${PROVENANCE_PORT}660%g" $HOME/.provenanced/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.provenanced/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.provenanced/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.provenanced/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.provenanced/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"1905nhash\"/" $HOME/.provenanced/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.provenanced/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.provenanced/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/provenanced.service > /dev/null <<EOF
[Unit]
Description=provenance-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which provenanced) start --home $HOME/.provenanced
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable provenanced && sudo systemctl start provenanced && sudo journalctl -fu provenanced -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/provenance_auto)
```

  </TabItem>
</Tabs>
