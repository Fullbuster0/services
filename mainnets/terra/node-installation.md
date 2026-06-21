---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-terra">
# Terra Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `phoenix-1` | Node Version: `v2.19.0` | Custom Port: `312`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export TERRA_CHAIN_ID="phoenix-1"" >> $HOME/.bash_profile
echo "export TERRA_PORT="312"" >> $HOME/.bash_profile
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
VER="1.25.5"
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
rm -rf terra
git clone https://github.com/phoenix-directive/core terra
cd terra
git checkout v2.4.0
make install
```

### Initialize The Node

```bash
terrad init $MONIKER --chain-id $TERRA_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "phoenix-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:31257"|' \
  $HOME/.terra/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.terra/config/genesis.json https://files.shazoes.xyz/mainnets/terra/genesis.json
wget -O $HOME/.terra/config/addrbook.json https://files.shazoes.xyz/mainnets/terra/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="f98acb897e5d0e684cddb546aeeeb0006480810a@terra-mainnet-rpc.shazoes.xyz:31256,0926c9c1438276d08899ca932f646af09ed9c66f@65.108.207.104:40156,472ce5a106d5a3079a3efdde4cef3d1ff4787810@147.135.223.144:26656,231c585900827a9e595f4483dcf45e3fa9b03868@162.55.237.11:26656,9e2588bb4b8ba2929e33818f6e6c2e2bb03ce08e@65.108.121.190:2020,ebe72e45b1d96906eb211ce7ed74c4a94dbf826a@46.105.223.14:26661,05da0d5d92443ba91f4ecbb9dc003d540b4cd0a6@35.212.136.69:26656,b1c3e2ff8c317df3b2716292a68e007274abe657@185.119.118.111:2000,f051f9d5b936db716539a7f9cc9f0dfeae467fea@65.21.235.237:26656,4ebf87085c2a3cc65d09549938985cf72a3c7734@65.108.97.229:26656,5c9660660ff89f90dff53f512a5bc979cddd292a@5.134.61.234:36656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.terra/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${TERRA_PORT}317%g;
s%:8080%:${TERRA_PORT}080%g;
s%:9090%:${TERRA_PORT}090%g;
s%:9091%:${TERRA_PORT}091%g;
s%:8545%:${TERRA_PORT}545%g;
s%:8546%:${TERRA_PORT}546%g;
s%:6065%:${TERRA_PORT}065%g" $HOME/.terra/config/app.toml
sed -i.bak -e "s%:26658%:${TERRA_PORT}658%g;
s%:26657%:${TERRA_PORT}657%g;
s%:6060%:${TERRA_PORT}060%g;
s%:26656%:${TERRA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${TERRA_PORT}656\"%;
s%:26660%:${TERRA_PORT}660%g" $HOME/.terra/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.terra/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.terra/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.terra/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.terra/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.015uluna\"/" $HOME/.terra/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.terra/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.terra/config/config.toml
```

### Download Snapshot

```bash
curl https://snapshot.shazoes.xyz/mainnets/snapshot-terra.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.terra
```

### Set Service File

```bash
sudo tee /etc/systemd/system/terrad.service > /dev/null <<EOF
[Unit]
Description=terra-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which terrad) start --home $HOME/.terra
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable terrad && sudo systemctl start terrad && sudo journalctl -fu terrad -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/terra_auto)
```

  </TabItem>
</Tabs>
