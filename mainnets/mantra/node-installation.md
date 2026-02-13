---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-mantra">
# Mantra Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `mantra-1` | Node Version: `v6.1.4` | Custom Port: `315`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export MANTRA_CHAIN_ID="mantra-1"" >> $HOME/.bash_profile
echo "export MANTRA_PORT="315"" >> $HOME/.bash_profile
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
rm -rf mantra
git clone https://github.com/MANTRA-Chain/mantrachain/ mantra
cd mantra
git checkout v6.1.4
make install
```

### Initialize The Node

```bash
mantrachaind init $MONIKER --chain-id $MANTRA_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "mantra-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:31557"|' \
  $HOME/.mantrachain/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.mantrachain/config/genesis.json https://files.shazoes.xyz/mainnets/mantra/genesis.json
wget -O $HOME/.mantrachain/config/addrbook.json https://files.shazoes.xyz/mainnets/mantra/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="06c502cda1a3efacb9997522c07c8c8b801e74f1@mantra-mainnet-rpc.shazoes.xyz:31256,0926c9c1438276d08899ca932f646af09ed9c66f@65.108.207.104:40156,472ce5a106d5a3079a3efdde4cef3d1ff4787810@147.135.223.144:26656,231c585900827a9e595f4483dcf45e3fa9b03868@162.55.237.11:26656,9e2588bb4b8ba2929e33818f6e6c2e2bb03ce08e@65.108.121.190:2020,ebe72e45b1d96906eb211ce7ed74c4a94dbf826a@46.105.223.14:26661,05da0d5d92443ba91f4ecbb9dc003d540b4cd0a6@35.212.136.69:26656,b1c3e2ff8c317df3b2716292a68e007274abe657@185.119.118.111:2000,f051f9d5b936db716539a7f9cc9f0dfeae467fea@65.21.235.237:26656,4ebf87085c2a3cc65d09549938985cf72a3c7734@65.108.97.229:26656,5c9660660ff89f90dff53f512a5bc979cddd292a@5.134.61.234:36656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.mantrachain/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${MANTRA_PORT}317%g;
s%:8080%:${MANTRA_PORT}080%g;
s%:9090%:${MANTRA_PORT}090%g;
s%:9091%:${MANTRA_PORT}091%g;
s%:8545%:${MANTRA_PORT}545%g;
s%:8546%:${MANTRA_PORT}546%g;
s%:6065%:${MANTRA_PORT}065%g" $HOME/.mantrachain/config/app.toml
sed -i.bak -e "s%:26658%:${MANTRA_PORT}658%g;
s%:26657%:${MANTRA_PORT}657%g;
s%:6060%:${MANTRA_PORT}060%g;
s%:26656%:${MANTRA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${MANTRA_PORT}656\"%;
s%:26660%:${MANTRA_PORT}660%g" $HOME/.mantrachain/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.mantrachain/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.mantrachain/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.mantrachain/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.mantrachain/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.01uom\"/" $HOME/.mantrachain/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.mantrachain/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.mantrachain/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/mantrachaind.service > /dev/null <<EOF
[Unit]
Description=mantra-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which mantrachaind) start --home $HOME/.mantrachain
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable mantrachaind && sudo systemctl start mantrachaind && sudo journalctl -fu mantrachaind -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/mantra_auto)
```

  </TabItem>
</Tabs>
