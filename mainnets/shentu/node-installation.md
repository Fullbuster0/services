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
Chain ID: `shentu-2.2` | Node Version: `v2.14.1` | Custom Port: `9`
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
git checkout v2.14.1
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
PEERS="e3f35c5abe22423f654c5e1b33318fbee7503cb3@149.202.64.145:27656,1480912d16f26b5ea1c4fea2496da95e44cbe845@65.109.115.226:14056,b6d870a3925baf56a70ea4d0a6a86f71d021257c@31.220.77.51:26656,722370de4cb68e3bcc7133b50e2c0e03110026de@209.145.56.75:26656,c7053b17cb50e6b190820fce2dc45b37ad479948@88.198.168.154:26656,c7f47b19bad10c2222ad528c73627a14e0108e9d@95.217.116.103:26456,a9f5bc2294cd41b3677337305309ae9687dfa8d5@8.208.44.201:26656,43b923d403b569575fbee4eef1c0fb0c5d39be2f@165.232.72.33:26656,20157e5c6538f1750618972db3c0d171dae8cf8c@209.159.150.62:26656,89757803f40da51678451735445ad40d5b15e059@169.155.169.81:26656,6abc14fdb30ea57be013a9021ffb75378fe4d11c@178.18.250.33:14056,3ca62ad1846b426835f28fd81ccd748007fb51c2@49.13.15.59:26656,4ba3f83efc53c834ba27eb22452840ee74aecf45@85.215.105.19:15604,1fa010a89dedf7dbb91c8239a4fe00c14ffe8715@161.97.133.184:26656,a8cd59ec2777e95d5b25278fd46f5069b2f8c25a@5.9.97.174:15607,d4cbdef21bde1fde444cd31f5a2842c76268f210@94.250.203.213:26656,207c47bed435e4174844064ef3f51ca35b059de2@5.189.128.119:26656,ed4db976ce074bfda0f436790f00e5a0716b4cc7@94.250.202.43:14056,32e2f9106d29ae9998c37e10adde030dbe223fb7@65.108.98.235:26956,e75aab6f20e0ac794e9aae1c18c89e428d381bda@195.201.167.242:26656,e3acfacbd8f08c8e61925a3363187b2737022407@47.253.53.245:26656,af55cb6531fd5e5818b374e312ee9f5b6ac471bb@65.21.167.185:14056,8888cb6071b560e2a5393394ea8d6babaaa33184@178.238.228.120:26656,94e911d79176c2ac90ce545b212429460dd34d5e@35.74.10.164:6656,9c0b20c318d0ee8f84475ad47afed59b24ba2ea4@95.217.193.17:26656,060027d3bc10ff7ebc1ec315ae5671c541e1568c@66.45.246.166:20016,3c1740cb7d646a31bc3236a7fb3cba1cc87eb08e@5.9.147.138:28656"
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
