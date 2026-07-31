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

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustc --version
```

### Download and Build Binaries

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
PEERS="23d311c322a87930c58714cb32dab19f9669c7b5@airchain-testnet-rpc.shazoes.xyz:20656,03c296401c5177ed06258d3bba0649131ef02fed@65.108.233.73:19656,b82f3cb589b730da922484a2a2c44b252bd3d5db@152.53.121.42:41656,910cc6790cc6f97f5e1f9f049e81917bceba4870@144.76.70.103:19656,301a14ccbcf3fc15f9f90619e39743a8bf9eeafd@65.109.93.124:30856,cfb052e64e508f4b40f0ec07b52a31abfda82270@95.217.62.179:11956,f84b41b95e828ee915aea19dd656cca7d39cf47b@37.17.244.207:33656,b43f7c96bb780d9ac535d3c1f78092cf8c455e85@104.36.23.246:26656,ca0a4b67fd6ffd6a70ea8d0e3c8d284de0f8222f@37.27.132.57:19656,1d7a1809b616ce2437a5978bebbfcefec4bc3aa0@193.34.212.80:60656"
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
