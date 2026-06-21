---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-shentu">
# Shentu Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `shentu-2.2` | Node Version: `v2.18.0` | Custom Port: `9`
</span>

<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SHENTU_CHAIN_ID="shentu-2.2"" >> $HOME/.bash_profile
echo "export SHENTU_PORT="9"" >> $HOME/.bash_profile
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
VER="1.22.5"
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
rm -rf shentu
git clone https://github.com/shentufoundation/shentu
cd shentu
git checkout v2.2.0
make install
```

### Initialize The Node

```bash
shentud config node tcp://localhost:${SHENTU_PORT}657
shentud config chain-id $SHENTU_CHAIN_ID
shentud init $MONIKER --chain-id $SHENTU_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.shentud/config/genesis.json https://files.shazoes.xyz/mainnets/shentu/genesis.json
wget -O $HOME/.shentud/config/addrbook.json https://files.shazoes.xyz/mainnets/shentu/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="f1a5fd39e7a3a09dc93080ac456aae052e0beb37@shentu-mainnet-rpc.shazoes.xyz:9656,207c47bed435e4174844064ef3f51ca35b059de2@5.189.128.119:26656,32e2f9106d29ae9998c37e10adde030dbe223fb7@65.108.98.235:26956,8931f8b5ae31e472c074a000b2d9f729c7ef4374@65.108.121.227:14056,32efae2d1cc2c01b87a3b925a8c37025e4a2f58a@116.96.45.205:26656,147eeac0de54a973ade15e46ca427b70d0d535b2@135.181.128.114:14056,1480912d16f26b5ea1c4fea2496da95e44cbe845@65.109.115.226:14056,a8cd59ec2777e95d5b25278fd46f5069b2f8c25a@5.9.97.174:15607,1c6c01bf6504206bdaa37bb02076b6c8a3d77338@8.208.44.73:26656,43f600ff746ad1d2dde47bbfe2aa18dd5fc08ff6@65.21.136.219:26656,75f067aa1d40ddadb1d32606fdbff16683e4b9d3@37.27.58.244:26656,e3f35c5abe22423f654c5e1b33318fbee7503cb3@149.202.64.145:27656,29dec607ea0c295cafd0a50eb6cce53e603ff35a@37.27.53.176:14056,94e911d79176c2ac90ce545b212429460dd34d5e@35.74.10.164:6656,af55cb6531fd5e5818b374e312ee9f5b6ac471bb@65.21.167.185:14056,f97807210f9547b8a5016fb18000b46072ca5e30@135.181.113.227:2407,dcceb7e119765d6ff54cb16fef8d008ba9099d56@52.202.184.217:26656,3c1740cb7d646a31bc3236a7fb3cba1cc87eb08e@5.9.147.138:28656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.shentud/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${SHENTU_PORT}317%g;
s%:8080%:${SHENTU_PORT}080%g;
s%:9090%:${SHENTU_PORT}090%g;
s%:9091%:${SHENTU_PORT}091%g;
s%:8545%:${SHENTU_PORT}545%g;
s%:8546%:${SHENTU_PORT}546%g;
s%:6065%:${SHENTU_PORT}065%g" $HOME/.shentud/config/app.toml
sed -i.bak -e "s%:26658%:${SHENTU_PORT}658%g;
s%:26657%:${SHENTU_PORT}657%g;
s%:6060%:${SHENTU_PORT}060%g;
s%:26656%:${SHENTU_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${SHENTU_PORT}656\"%;
s%:26660%:${SHENTU_PORT}660%g" $HOME/.shentud/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.shentud/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.shentud/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.shentud/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.shentud/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001uctk\"/" $HOME/.shentud/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.shentud/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.shentud/config/config.toml
```

### Download Snapshot

```bash
curl https://snapshot.shazoes.xyz/mainnets/snapshot-shentu.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.shentud
```

### Set Service File

```bash
sudo tee /etc/systemd/system/shentud.service > /dev/null <<EOF
[Unit]
Description=shentu-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which shentud) start --home $HOME/.shentud
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable shentud && sudo systemctl start shentud && sudo journalctl -fu shentud -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/shentu_auto)
```

  </TabItem>
</Tabs>
