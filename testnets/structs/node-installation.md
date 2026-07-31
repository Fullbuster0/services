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
  <span className="notice-text">Network no longer actively validated · Services docs only (no updated)</span>
</div>

<div className="h1-with-icon icon-structs">
# Structs Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `structstestnet-101` | Node Version: `v0.6.0-beta` | Custom Port: `25`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export STRUCTS_CHAIN_ID="structstestnet-101"" >> $HOME/.bash_profile
echo "export STRUCTS_PORT="25"" >> $HOME/.bash_profile
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
curl https://get.ignite.com/cli! | bash
ignite version
```

### Download and Build Binaries

```bash
cd $HOME
rm -rf structsd
git clone --branch v0.6.0-beta https://github.com/playstructs/structsd.git
cd structsd
ignite chain build
```

### Initialize The Node

```bash
structsd init $MONIKER --chain-id $STRUCTS_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "structstestnet-101"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:25657"|' \
  $HOME/.structs/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.structs/config/genesis.json https://files.shazoes.xyz/testnets/structs/genesis.json
wget -O $HOME/.structs/config/addrbook.json https://files.shazoes.xyz/testnets/structs/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="a32e2f9d8ec4bd56a1caed03a2fa8bbadbe75995@95.217.89.100:14456,3fba9d1c730954bd02edd712de244f2e97e5e13c@88.99.61.53:32656,fd3cc5f0769dea1b520c3d3eea230a2f196c5693@144.76.92.22:10656,f9ff152e331904924c26a4f8b1f46e859d574342@155.138.142.145:26656,197cfbe9f1c7bb8446a9e217d6e3710014bdc496@95.111.248.136:26656,372e686bc84528d9beccf15429f94846cd0f54d8@159.69.193.68:11656,8450315267be7073317c52432a1a8f7a94e039b8@192.155.91.61:26656,9b5164e4ae58f1a5e8f7a8681216dc79cf111aef@188.165.226.46:26696,09e8f5be4c58c0a8ddf5596742a2322431523f2f@216.128.181.240:26656,4d6a8ba29019e2af39910edad5665d8d91d46dde@65.21.32.216:60856"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.structs/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${STRUCTS_PORT}317%g;
s%:8080%:${STRUCTS_PORT}080%g;
s%:9090%:${STRUCTS_PORT}090%g;
s%:9091%:${STRUCTS_PORT}091%g;
s%:8545%:${STRUCTS_PORT}545%g;
s%:8546%:${STRUCTS_PORT}546%g;
s%:6065%:${STRUCTS_PORT}065%g" $HOME/.structs/config/app.toml
sed -i.bak -e "s%:26658%:${STRUCTS_PORT}658%g;
s%:26657%:${STRUCTS_PORT}657%g;
s%:6060%:${STRUCTS_PORT}060%g;
s%:26656%:${STRUCTS_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${STRUCTS_PORT}656\"%;
s%:26660%:${STRUCTS_PORT}660%g" $HOME/.structs/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.structs/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.structs/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.structs/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.structs/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0alpha\"/" $HOME/.structs/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.structs/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.structs/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/structsd.service > /dev/null <<EOF
[Unit]
Description=structs-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which structsd) start --home $HOME/.structs
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable structsd && sudo systemctl start structsd && sudo journalctl -fu structsd -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/structs_auto)
```

  </TabItem>
</Tabs>
