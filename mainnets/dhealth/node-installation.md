---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-dhealth">
# Dhealth Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `dhealth` | Node Version: `v1.0.0` | Custom Port: `5`
</span>

<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export DHEALTH_CHAIN_ID="dhealth"" >> $HOME/.bash_profile
echo "export DHEALTH_PORT="5"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl clang pkg-config libssl-dev jq build-essential tar wget  bsdmainutils git make ncdu gcc git jq htop tmux chrony liblz4-tool fail2ban -y
```

### Install GO

```bash
cd $HOME
VER="1.21.13"
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

### Install Ignite

```bash
sudo curl https://get.ignite.com/cli! | bash
sudo mv ignite /usr/local/bin/
ignite version
```

### Download and Build Binaries

```bash
cd $HOME
git clone https://github.com/dhealthproject/dhealth.git
cd dhealth
git checkout v1.0.0
ignite chain build
```

### Initialize The Node

```bash
dhealthd config node tcp://localhost:${DHEALTH_PORT}657
dhealthd config chain-id $DHEALTH_CHAIN_ID
dhealthd init $MONIKER --chain-id $DHEALTH_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.dhealth/config/genesis.json https://files.shazoes.xyz/mainnets/dhealth/genesis.json
wget -O $HOME/.dhealth/config/addrbook.json https://files.shazoes.xyz/mainnets/dhealth/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="9ff70edee323ba40445e79e4108ae8c5aa7dd63f@78.46.174.72:28256,07243cc6e34d0f829bdb7450b9d5e7da8ffa7869@162.19.124.59:61656,cc45db56335a918651dfe29a2b70a534b335f0ef@46.101.196.105:26656,46dc3bae5e14bc3d639bdac99b61c4db8bb04b76@153.127.55.183:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.dhealth/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${DHEALTH_PORT}317%g;
s%:8080%:${DHEALTH_PORT}080%g;
s%:9090%:${DHEALTH_PORT}090%g;
s%:9091%:${DHEALTH_PORT}091%g;
s%:8545%:${DHEALTH_PORT}545%g;
s%:8546%:${DHEALTH_PORT}546%g;
s%:6065%:${DHEALTH_PORT}065%g" $HOME/.dhealth/config/app.toml
sed -i.bak -e "s%:26658%:${DHEALTH_PORT}658%g;
s%:26657%:${DHEALTH_PORT}657%g;
s%:6060%:${DHEALTH_PORT}060%g;
s%:26656%:${DHEALTH_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${DHEALTH_PORT}656\"%;
s%:26660%:${DHEALTH_PORT}660%g" $HOME/.dhealth/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.dhealth/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.dhealth/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.dhealth/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.dhealth/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001udhp\"/" $HOME/.dhealth/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.dhealth/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.dhealth/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/dhealthd.service > /dev/null <<EOF
[Unit]
Description=dhealth-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which dhealthd) start --home $HOME/.dhealth
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable dhealthd && sudo systemctl start dhealthd && sudo journalctl -fu dhealthd -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/dhealth_auto)
```

  </TabItem>
</Tabs>
