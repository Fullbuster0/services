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
PEERS="06c502cda1a3efacb9997522c07c8c8b801e74f1@mantra-mainnet-rpc.shazoes.xyz:31256,ddf57b62c47bc843dd0844d1a75fb95db9b695ed@37.27.108.165:26006,dc5ccb3ed2d7e4b822ef6ac5b64bede4d122115c@65.21.136.219:26656,e378364a714e86f034ba310506fa0e917b3d1db7@195.201.115.0:44656,57988eaefb806c67020cf2f6fa3c713945818f2f@142.132.187.206:26656,60fdb2298cf47a93c8cf173ef785f7d4a2d4d3fb@65.108.201.138:25156,03b4bc5c9f9ea90c29b8016752e40e03a7e16221@34.18.105.95:26656,4de3d0e0ce97a8d130443c8ed4db4876147a3cc5@34.18.44.219:26656,284fc3f98e735142b0b9f55db7896059f76e40a4@35.220.168.91:26656,c1183d59637c454557934c1896fcd312641b80cb@47.129.143.107:26656,fef97d99c827bc39db8a291dcdd3381d6390f45c@5.161.205.87:26656,ae2d751629284caa0166a4265dbb80c48ad3b40e@176.9.30.178:25156,6cd6d1682de686f8cac1a40e353e71742ca165e5@5.9.73.170:25156,f73043eb78ece59665befbcf998d5670fb8eb406@35.220.230.175:26656,482d9fa4bfcd01dd217498d7268b6b89b06f153c@34.18.182.211:26656,1e71bd43ee1e2541138c66dd9f37f786b491f89f@139.59.229.166:26656,2f4804aad290b5099792c15cccb47f40d42b9ab9@65.108.230.146:25156,7c5f9b4a400d259900cdea7a8f1d30ede263daef@135.181.138.95:2220"
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

### Download Snapshot

```bash
curl https://snapshot1.shazoes.xyz/mainnets/snapshot-mantra.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.lava
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
