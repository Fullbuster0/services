---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-airchain">
# Airchain Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `varanasi-1` | Node Version: `v0.3.2` | Custom Port: `20`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export AIR_CHAIN_ID="varanasi-1"" >> $HOME/.bash_profile
echo "export AIR_PORT="20"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install dependencies

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

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustc --version
```

### Download and build binaries

```bash
cd $HOME
wget -O junctiond https://github.com/airchains-network/junction/releases/download/v0.3.2/junctiond-linux-amd64
chmod +x junctiond
mv junctiond $HOME/go/bin/
```

### Initialize The Node

```bash
junctiond config node tcp://localhost:${AIR_PORT}657
junctiond config chain-id $AIR_CHAIN_ID
junctiond config keyring-backend test
junctiond init $MONIKER --chain-id $AIR_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.junctiond/config/genesis.json https://files.shazoes.xyz/testnets/airchain/genesis.json
wget -O $HOME/.junctiond/config/addrbook.json https://files.shazoes.xyz/testnets/airchain/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="db686fcfdf0b4676d601d5beb11faee5ad96bff1@37.27.71.199:28656,8c229309660496e71b8a9d1edee46a18693b8e70@65.109.111.234:19656,0b4e78189c9148dda5b1b98c6e46b764337558a3@91.227.33.18:19656,1d7a1809b616ce2437a5978bebbfcefec4bc3aa0@193.34.212.80:60656,4aaa6f76a1009feccffa90e8a00dd6343ca9b01f@152.53.49.146:19656,3650f3737940af2d6cc8d17244706505648ff639@212.56.32.148:14156,43c265128fd9be02721df03e8ba4bcf8c982a062@1.53.252.54:26656,ca0a4b67fd6ffd6a70ea8d0e3c8d284de0f8222f@37.27.132.57:19656,b57745eecc8c9638a3599c81f82dd69720df0ed8@94.130.164.82:26756"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.junctiond/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${AIR_PORT}317%g;
s%:8080%:${AIR_PORT}080%g;
s%:9090%:${AIR_PORT}090%g;
s%:9091%:${AIR_PORT}091%g;
s%:8545%:${AIR_PORT}545%g;
s%:8546%:${AIR_PORT}546%g;
s%:6065%:${AIR_PORT}065%g" $HOME/.junctiond/config/app.toml
sed -i.bak -e "s%:26658%:${AIR_PORT}658%g;
s%:26657%:${AIR_PORT}657%g;
s%:6060%:${AIR_PORT}060%g;
s%:26656%:${AIR_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${AIR_PORT}656\"%;
s%:26660%:${AIR_PORT}660%g" $HOME/.junctiond/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.junctiond/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.junctiond/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.junctiond/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.junctiond/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025uamf\"/" $HOME/.junctiond/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.junctiond/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.junctiond/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/junctiond.service > /dev/null <<EOF
[Unit]
Description=airchain-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which junctiond) start --home $HOME/.junctiond
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable junctiond && sudo systemctl start junctiond && sudo journalctl -fu junctiond -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/airchain_auto)
```

  </TabItem>
</Tabs>
