---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-cardchain">
# Cardchain Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `cardtestnet-12` | Node Version: `v0.16.0` | Custom Port: `21`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export CARD_CHAIN_ID="cardtestnet-12"" >> $HOME/.bash_profile
echo "export CARD_PORT="21"" >> $HOME/.bash_profile
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
VER="1.21.6"
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
wget -O Cardchaind https://github.com/DecentralCardGame/Cardchain/releases/download/v0.16.0/Cardchaind
chmod +x Cardchaind
sudo mv Cardchaind $HOME/go/bin/
```

### Initialize The Node

```bash
Cardchaind config node tcp://localhost:${CARD_PORT}657
Cardchaind config chain-id $CARD_CHAIN_ID
Cardchaind init $MONIKER --chain-id $CARD_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.cardchaind/config/genesis.json https://files.shazoes.xyz/testnets/cardchain/genesis.json
wget -O $HOME/.cardchaind/config/addrbook.json https://files.shazoes.xyz/testnets/cardchain/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="a615a4f29b48a737ceb473638876df7420847f25@82.146.33.77:26656,8fac860cb5ed5067cdf3943689a8c3964eadd262@207.244.253.244:39656,b32cf40549b67f7366e91df670e5cbae0eb5a9b5@65.109.36.232:12456,050324f017639e5faf213ec85ec26c7fa104da3f@157.90.226.221:31656,8861ab5e6421ab94efd5b1d8dcb11d344ee9bb58@75.119.134.140:21656,443c0471d3bb10717c8e0df5b0171c87c1d6ed9d@142.132.152.46:22656,d8babb0317250c3291e646efde372025efee6178@5.78.107.235:26656,d0bb15daba08a7c84c45d8ee48daeadf42d08a6a@185.144.99.114:26656,2a0fb04657337a73df70e586b5091a813ec0a2c3@167.235.155.8:26656,35c8779026ceb17659b722b6a768e5a7f070c770@84.247.161.158:31656,742d3fa2aa65368d859f3893fee05ecb92e8f995@65.108.227.112:26656,009ee7e4ed7a58fb49fd760df8e99069b3958e3a@95.217.148.179:37656,45b4cf1467146c673dad0455b506f88827b2eaba@65.109.93.58:35656,ab2ad2744f3b193f72cb4fd42465155bfca0ccb4@65.109.57.180:13256,b41f7ce40c863ee7e20801e6cd3a97237a79114a@65.21.53.39:16656,947aa14a9e6722df948d46b9e3ff24dd72920257@65.108.231.124:31656,18f51e123d595868d97e701bb37ca862841571ce@65.108.237.231:56108,263bea65bcf39d1244d0d251b2f089c0b5c56a13@144.76.97.251:38656,e6e2fac705b824cbd6b929fb06005c499b408a02@113.176.163.161:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.cardchaind/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${CARD_PORT}317%g;
s%:8080%:${CARD_PORT}080%g;
s%:9090%:${CARD_PORT}090%g;
s%:9091%:${CARD_PORT}091%g;
s%:8545%:${CARD_PORT}545%g;
s%:8546%:${CARD_PORT}546%g;
s%:6065%:${CARD_PORT}065%g" $HOME/.cardchaind/config/app.toml
sed -i.bak -e "s%:26658%:${CARD_PORT}658%g;
s%:26657%:${CARD_PORT}657%g;
s%:6060%:${CARD_PORT}060%g;
s%:26656%:${CARD_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${CARD_PORT}656\"%;
s%:26660%:${CARD_PORT}660%g" $HOME/.cardchaind/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.cardchaind/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.cardchaind/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.cardchaind/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.cardchaind/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025ubpf\"/" $HOME/.cardchaind/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.cardchaind/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.cardchaind/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/Cardchaind.service > /dev/null <<EOF
[Unit]
Description=cardchain-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which Cardchaind) start --home $HOME/.cardchaind
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable Cardchaind && sudo systemctl start Cardchaind && sudo journalctl -fu Cardchaind -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/cardchain_auto)
```

  </TabItem>
</Tabs>
