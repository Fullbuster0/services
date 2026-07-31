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

<div className="h1-with-icon icon-regen">
# regen Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `regen-1` | Node Version: `v5.1.0` | Custom Port: `7`
</span>
<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export REGEN_CHAIN_ID="regen"" >> $HOME/.bash_profile
echo "export REGEN_PORT="7"" >> $HOME/.bash_profile
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
rm -rf regen
git clone https://github.com/regen-network/regen-ledger.git regen
cd regen
git checkout v5.1.0
make install
```

### Initialize The Node

```bash
regen config node tcp://localhost:${REGEN_PORT}657
regen config chain-id $REGEN_CHAIN_ID
regen init $MONIKER --chain-id $REGEN_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.regen/config/genesis.json https://files.shazoes.xyz/mainnets/regen/genesis.json
wget -O $HOME/.regen/config/addrbook.json https://files.shazoes.xyz/mainnets/regen/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="9ff70edee323ba40445e79e4108ae8c5aa7dd63f@78.46.174.72:28256,07243cc6e34d0f829bdb7450b9d5e7da8ffa7869@162.19.124.59:61656,cc45db56335a918651dfe29a2b70a534b335f0ef@46.101.196.105:26656,46dc3bae5e14bc3d639bdac99b61c4db8bb04b76@153.127.55.183:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.regen/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${REGEN_PORT}317%g;
s%:8080%:${REGEN_PORT}080%g;
s%:9090%:${REGEN_PORT}090%g;
s%:9091%:${REGEN_PORT}091%g;
s%:8545%:${REGEN_PORT}545%g;
s%:8546%:${REGEN_PORT}546%g;
s%:6065%:${REGEN_PORT}065%g" $HOME/.regen/config/app.toml
sed -i.bak -e "s%:26658%:${REGEN_PORT}658%g;
s%:26657%:${REGEN_PORT}657%g;
s%:6060%:${REGEN_PORT}060%g;
s%:26656%:${REGEN_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${REGEN_PORT}656\"%;
s%:26660%:${REGEN_PORT}660%g" $HOME/.regen/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.regen/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.regen/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.regen/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.regen/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001uregen\"/" $HOME/.regen/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.regen/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.regen/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/regen.service > /dev/null <<EOF
[Unit]
Description=regen-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which regen) start --home $HOME/.regen
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable regen && sudo systemctl start regen && sudo journalctl -fu regen -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/regen_auto)
```

  </TabItem>
</Tabs>
