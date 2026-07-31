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

<div className="h1-with-icon icon-synternet">
# Synternet Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `synternet-1` | Node Version: `v0.25` | Custom Port: `11`
</span>

<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SYNTERNET_CHAIN_ID="synternet-1"" >> $HOME/.bash_profile
echo "export SYNTERNET_PORT="11"" >> $HOME/.bash_profile
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
wget https://github.com/Synternet/synternet-chain-releases/releases/download/v0.25/syntd-linux-amd64-v0.25 -O syntd
chmod +x syntd
sudo mv syntd $HOME/go/bin/
```

### Initialize The Node

```bash
syntd init $MONIKER --chain-id $SYNTERNET_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "synternet-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:11657"|' \
  $HOME/.amber/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.amber/config/genesis.json https://files.shazoes.xyz/mainnets/synternet/genesis.json
wget -O $HOME/.amber/config/addrbook.json https://files.shazoes.xyz/mainnets/synternet/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="e74678c231cd86944f9819244f0a3879576ebd80@148.251.176.12:3000,613e8033a587340d08144084300b003bcfe2ca43@79.137.10.226:26656,2eed7e175d204680af243e008e21950f81b8d455@34.89.206.173:26656,95b14ec701608044c261ebd15d0b3bd84e295acb@72.46.84.135:26656,994a52988585be44a90574f4dc73a9bfbddd528e@37.252.186.222:26656,5684069fabe946bea91dabbdac0cae069888dfb4@65.21.234.111:31656,38f7accfdbc6690a60837c397d22457a0f08a362@37.27.57.224:26656,13af4eef823f8c9cac093dbc405edff280dc9d87@78.141.193.216:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.amber/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${SYNTERNET_PORT}317%g;
s%:8080%:${SYNTERNET_PORT}080%g;
s%:9090%:${SYNTERNET_PORT}090%g;
s%:9091%:${SYNTERNET_PORT}091%g;
s%:8545%:${SYNTERNET_PORT}545%g;
s%:8546%:${SYNTERNET_PORT}546%g;
s%:6065%:${SYNTERNET_PORT}065%g" $HOME/.amber/config/app.toml
sed -i.bak -e "s%:26658%:${SYNTERNET_PORT}658%g;
s%:26657%:${SYNTERNET_PORT}657%g;
s%:6060%:${SYNTERNET_PORT}060%g;
s%:26656%:${SYNTERNET_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${SYNTERNET_PORT}656\"%;
s%:26660%:${SYNTERNET_PORT}660%g" $HOME/.amber/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.amber/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.amber/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.amber/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.amber/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.01usynt\"/" $HOME/.amber/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.amber/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.amber/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/syntd.service > /dev/null <<EOF
[Unit]
Description=synternet-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which syntd) start --home $HOME/.amber
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable syntd && sudo systemctl start syntd && sudo journalctl -fu syntd -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/synternet_auto)
```

  </TabItem>
</Tabs>
