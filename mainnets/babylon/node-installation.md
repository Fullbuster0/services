---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-babylon">
# Babylon Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `bbn-1` | Node Version: `v2.2.0` | Custom Port: `302`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export BABYLON_CHAIN_ID="bbn-1"" >> $HOME/.bash_profile
echo "export BABYLON_PORT="301"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install dependencies

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

### Download and build binaries

```bash
cd $HOME
rm -rf babylon
git clone https://github.com/babylonlabs-io/babylon.git
cd babylon
git checkout v2.2.0
BABYLON_BUILD_OPTIONS="mainnet" make install
```

### Initialize The Node

```bash
babylond init $MONIKER --chain-id $BABYLON_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "bbn-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30157"|' \
  $HOME/.babylond/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.babylond/config/genesis.json https://files.shazoes.xyz/mainnets/babylon/genesis.json
wget -O $HOME/.babylond/config/addrbook.json https://files.shazoes.xyz/mainnets/babylon/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="bfd985bcc5e512f492fd206d6a973775ecd9a000@45.32.126.22:26656,4caf0eceae6c8ad2c819da35d04624b2e79a7451@176.158.37.176:29656,e4ab225d6c4c0d0bf06a6610e07a5f29c2325bf5@88.99.101.149:20656,e80aa0305bea31f930facf5547e37c731ffffbc4@78.46.174.72:20656,2acadbf9b3c8773513297d69b0f8869682e5806d@141.94.193.28:55706,454df8943ff6e90f2055e5f9c2907e1fd41319e0@91.134.78.98:26656,0b0561b615a382500311bff9bb380f2c39cd8334@67.213.114.49:26656,38badf1db162e9b7ddc8afbad1cf322567b452b1@207.148.118.251:26656,8801b65a1c324391e62ff256e93ecd8f3c61a19d@74.118.143.212:26656,37c7c90242166045f3cd0e3baf626212a9dd80be@51.161.172.54:55706"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.babylond/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${BABYLON_PORT}317%g;
s%:8080%:${BABYLON_PORT}080%g;
s%:9090%:${BABYLON_PORT}090%g;
s%:9091%:${BABYLON_PORT}091%g;
s%:8545%:${BABYLON_PORT}545%g;
s%:8546%:${BABYLON_PORT}546%g;
s%:6065%:${BABYLON_PORT}065%g" $HOME/.babylond/config/app.toml
sed -i.bak -e "s%:26658%:${BABYLON_PORT}658%g;
s%:26657%:${BABYLON_PORT}657%g;
s%:6060%:${BABYLON_PORT}060%g;
s%:26656%:${BABYLON_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${BABYLON_PORT}656\"%;
s%:26660%:${BABYLON_PORT}660%g" $HOME/.babylond/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.babylond/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.babylond/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.babylond/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.babylond/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.002ubbn\"/" $HOME/.babylond/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.babylond/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.babylond/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/babylond.service > /dev/null <<EOF
[Unit]
Description=babylon-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which babylond) start --home $HOME/.babylond
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable babylond && sudo systemctl start babylond && sudo journalctl -fu babylond -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/babylon_auto)
```

  </TabItem>
</Tabs>
