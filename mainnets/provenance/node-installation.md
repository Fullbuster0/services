---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-provenance">
# Provenance Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `pio-mainnet-1` | Node Version: `v1.24.0` | Custom Port: `13`
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
wget https://github.com/provenance-io/provenance/releases/download/v1.24.0/provenance-linux-amd64-v1.24.0.zip
unzip provenance-linux-amd64-v1.24.0.zip
chmod +x $HOME/bin/provenanced
rm provenance-linux-amd64-v1.24.0.zip
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
PEERS="57197d502a99ae640273bfe7d388fdb09ff33cf6@65.109.23.55:20106,f8c8a2baa9508ff503c3cac9a0d36146b9d65d55@34.148.91.199:26656,0b154462c3969dcd509f33bc283716cfd23c6844@37.187.149.80:26676,d726eaf88fd36881b11fe857ba9ded02802c1521@143.198.57.205:26656,1d634eb65723ecd18d101e8041990c7cd5fa2a19@37.17.244.207:57656,026e5ea19bc6aa5c67fe62f5f30f417929433b93@207.121.13.108:56656,51494b1f7123cadbc56a7b6c1225f26ff25ce81c@135.181.208.245:56656,768cef4673e00f92e9dde27ad0cc7374e3330b51@168.119.139.86:36696"
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
