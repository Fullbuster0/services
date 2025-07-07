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
PEERS="9aceed722f09a3b0de202bbdd98dc345e2b84731@65.108.109.48:26656,61b7861a468dfa84532526afd98bea81bf41a874@121.78.247.244:16656,9524bac2c6be4d8b747e6b75d9b924000f9f6835@95.216.12.106:23456,755b3c1ecedb05ff08929da3b17174230a009182@138.201.200.188:29956,752bb5f1c914c5294e0844ddc908548115c1052c@65.108.236.5:14556,89757803f40da51678451735445ad40d5b15e059@169.155.169.178:26656,19477d71ab20a45630bb56a4a099200784d9dfd8@135.181.57.156:29956,bf3b173d9e1dc717fdaa7503119350c3411f6a7b@65.109.124.52:29956,f3c3918006dba796ed67715eba9dea2bcae083e9@125.131.208.67:12002,3bfca1233c3692985880e290fc598f15515adf5b@95.217.141.114:14556"
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
