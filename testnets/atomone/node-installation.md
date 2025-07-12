---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-atomone">
# Atomone Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `atomone-testnet-1` | Node Version: `v2.0.0-rc2` | Custom Port: `31`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export ATOMONE_CHAIN_ID="atomone-testnet-1"" >> $HOME/.bash_profile
echo "export ATOMONE_PORT="31"" >> $HOME/.bash_profile
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

### Download and Build Binaries

```bash
cd $HOME
git clone https://github.com/atomone-hub/atomone.git
cd atomone
git checkout v2.0.0-rc2
make install
```

### Initialize The Node

```bash
atomoned config node tcp://localhost:${ATOMONE_PORT}657
atomoned config chain-id $ATOMONE_CHAIN_ID
atomoned init $MONIKER --chain-id $ATOMONE_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.atomone/config/genesis.json https://files.shazoes.xyz/testnets/atomone/genesis.json
wget -O $HOME/.atomone/config/addrbook.json https://files.shazoes.xyz/testnets/atomone/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="501385f2af01465f64ef1c08b9438e06742222a6@atomone-testnet-rpc.shazoes.xyz:31656,60355b701ce2d83ec3ad42271a4202d6b6728cf4@135.181.178.120:15656,75ccd37e1ce38d1efde90c293ff8d1ffcf7e3bfa@188.165.226.46:26706,2231b2285c3ba2f0dec145633d5bc90b8cf782bd@161.97.77.219:26656,5861b1bde33340c443d75c7727525711ccc0b825@65.108.226.44:14556,dd27a23e0adc98d6dc53802d95ce581b06723845@185.252.233.217:26656,4df42d308b1aafb2e1efebda744441d75507c1a8@94.130.164.82:14556,112c3c63d5fa03dbfb917d41c1ab9f8412b44128@37.27.63.150:27956,9c2e0452539d913214048111afd4872ea2edd32f@65.108.206.118:61356,85e441cfe74b8c0f8b820beff46edab20e92716c@8.52.201.252:62656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.atomone/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${ATOMONE_PORT}317%g;
s%:8080%:${ATOMONE_PORT}080%g;
s%:9090%:${ATOMONE_PORT}090%g;
s%:9091%:${ATOMONE_PORT}091%g;
s%:8545%:${ATOMONE_PORT}545%g;
s%:8546%:${ATOMONE_PORT}546%g;
s%:6065%:${ATOMONE_PORT}065%g" $HOME/.atomone/config/app.toml
sed -i.bak -e "s%:26658%:${ATOMONE_PORT}658%g;
s%:26657%:${ATOMONE_PORT}657%g;
s%:6060%:${ATOMONE_PORT}060%g;
s%:26656%:${ATOMONE_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${ATOMONE_PORT}656\"%;
s%:26660%:${ATOMONE_PORT}660%g" $HOME/.atomone/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.atomone/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.atomone/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.atomone/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.atomone/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.025uatone,0.025uphoton\"/" $HOME/.atomone/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.atomone/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.atomone/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/atomoned.service > /dev/null <<EOF
[Unit]
Description=atomone-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which atomoned) start --home $HOME/.atomone
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable atomoned && sudo systemctl start atomoned && sudo journalctl -fu atomoned -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/atomone_auto)
```

  </TabItem>
</Tabs>
