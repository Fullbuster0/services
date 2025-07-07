---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-galactica">
# Galactica Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `galactica_9302-1` | Node Version: `v0.1.2` | Custom Port: `32`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export GALACTICA_CHAIN_ID="galactica_9302-1"" >> $HOME/.bash_profile
echo "export GALACTICA_PORT="32"" >> $HOME/.bash_profile
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
rm -rf galactica
git clone https://github.com/Galactica-corp/galactica
cd galactica
git checkout v0.1.2
make build
mv $HOME/galactica/build/galacticad $HOME/go/bin
```

### Initialize The Node

```bash
galacticad config node tcp://localhost:${GALACTICA_PORT}657
galacticad config chain-id $GALACTICA_CHAIN_ID
galacticad config keyring-backend test
galacticad init $MONIKER --chain-id $GALACTICA_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.galactica/config/genesis.json https://files.shazoes.xyz/testnets/galactica/genesis.json
wget -O $HOME/.galactica/config/addrbook.json https://files.shazoes.xyz/testnets/galactica/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="e926f2e20568e61646558a2b8fd4a4e46d77903f@141.95.110.124:26656,a028446e34e3c5bd198a60bf6e799a05e8db16a1@116.202.162.188:15656,8949fb771f2859248bf8b315b6f2934107f1cf5a@168.119.241.1:26656,27fc47bc018e1327eddfe99092cc64b3bc594bf9@144.76.97.251:26756,f3cd6b6ebf8376e17e630266348672517aca006a@46.4.5.45:27456,c722e6dc5f762b0ef19be7f8cc8fd67cdf988946@49.12.96.14:26656,3afb7974589e431293a370d10f4dcdb73fa96e9b@157.90.158.222:26656,f2ea5839ecea55e02a859f60926e94eef73a50a6@103.35.64.107:10656,707af7d29be8d3fff3c4f0cdc0b8986a6a8aff63@95.217.200.98:28656,15c8ce51492b22b13be095aac62cf2c33a1cf44e@65.109.68.87:30656,9990ab130eac92a2ed1c3d668e9a1c6e811e8f35@148.251.177.108:27456"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.galactica/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${GALACTICA_PORT}317%g;
s%:8080%:${GALACTICA_PORT}080%g;
s%:9090%:${GALACTICA_PORT}090%g;
s%:9091%:${GALACTICA_PORT}091%g;
s%:8545%:${GALACTICA_PORT}545%g;
s%:8546%:${GALACTICA_PORT}546%g;
s%:6065%:${GALACTICA_PORT}065%g" $HOME/.galactica/config/app.toml
sed -i.bak -e "s%:26658%:${GALACTICA_PORT}658%g;
s%:26657%:${GALACTICA_PORT}657%g;
s%:6060%:${GALACTICA_PORT}060%g;
s%:26656%:${GALACTICA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${GALACTICA_PORT}656\"%;
s%:26660%:${GALACTICA_PORT}660%g" $HOME/.galactica/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.galactica/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.galactica/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.galactica/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.galactica/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001agnet\"/" $HOME/.galactica/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.galactica/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.galactica/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/galacticad.service > /dev/null <<EOF
[Unit]
Description=galactica-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which galacticad) start --home $HOME/.galactica
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable galacticad && sudo systemctl start galacticad && sudo journalctl -fu galacticad -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/galactica_auto)
```

  </TabItem>
</Tabs>
