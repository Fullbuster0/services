---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-warden">
# Warden Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `chiado_10010-1` | Node Version: `v0.6.2` | Custom Port: `29`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export WARDEN_CHAIN_ID="chiado_10010-1"" >> $HOME/.bash_profile
echo "export WARDEN_PORT="32"" >> $HOME/.bash_profile
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
rm -rf bin
mkdir bin && cd bin
wget -O wardend https://github.com/warden-protocol/wardenprotocol/releases/download/v0.6.2/wardend-0.6.2-linux-amd64
chmod +x wardend
mv $HOME/bin/wardend $HOME/go/bin
```

### Initialize The Node

```bash
wardend config node tcp://localhost:${WARDEN_PORT}657
wardend config chain-id $WARDEN_CHAIN_ID
wardend config keyring-backend test
wardend init $MONIKER --chain-id $WARDEN_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.warden/config/genesis.json https://files.shazoes.xyz/testnets/warden/genesis.json
wget -O $HOME/.warden/config/addrbook.json https://files.shazoes.xyz/testnets/warden/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="41a3a66993696c5e5d44945de2036227a4578fb3@195.201.241.107:56296,e9f4e2eaee32852dda0488db591c01b40b9c73aa@195.3.223.78:11956,0fb6439f5e2cfc8622501769bb071076bce9dfc1@116.202.150.231:18656,d5c6b1d38c4b8d0a0189f419d9c014c491970e89@38.242.146.0:22656,2f99ac7e72cc8c1f951e027d6088b8a920163237@65.109.111.234:18656,77451ec9ae8d5536704aadfec1f7e07cd41f29ac@135.181.191.99:37656,26943d39c1a2c39b87d14cafaad1c323e1960291@65.109.84.33:27356,a159f729d8adda00013c157a18ba76bd0af1a64b@159.69.74.237:38736,0aa24924ac019823588aa5731a485e0bfe246162@188.165.228.73:26656,33c8a7ba4b53ee5cb8f9bed304a91d576e63136c@94.16.115.147:18656,1b364274f2327ff55c1e5a11566b4e9789dcef82@94.130.143.122:30656,2d2c7af1c2d28408f437aef3d034087f40b85401@52.51.132.79:26656,9f5c904293c1c98821606b0dc2fd22d6c874cf8e@65.108.199.62:18656,129b6bc5c1367bafda1cad393005fb31c3636f1a@31.220.84.185:26656,e2345cb48f03169d541df2cb8886c175d927d166@65.109.27.148:18656,31564e70d691c7622e48533c2a9892172a47655a@82.197.68.45:26656,de9e8c44039e240ff31cbf976a0d4d673d4e4734@188.165.213.192:26656,d8d46d0175fe948529aa52d696e2fcf50691c492@162.55.97.180:15656,adc3ce9502f19fb585a807e45541bf4bc8172519@185.230.138.142:50656,fe0f59a648d737af1632a5577d30c62717aa82fa@135.181.236.254:37656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.warden/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${WARDEN_PORT}317%g;
s%:8080%:${WARDEN_PORT}080%g;
s%:9090%:${WARDEN_PORT}090%g;
s%:9091%:${WARDEN_PORT}091%g;
s%:8545%:${WARDEN_PORT}545%g;
s%:8546%:${WARDEN_PORT}546%g;
s%:6065%:${WARDEN_PORT}065%g" $HOME/.warden/config/app.toml
sed -i.bak -e "s%:26658%:${WARDEN_PORT}658%g;
s%:26657%:${WARDEN_PORT}657%g;
s%:6060%:${WARDEN_PORT}060%g;
s%:26656%:${WARDEN_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${WARDEN_PORT}656\"%;
s%:26660%:${WARDEN_PORT}660%g" $HOME/.warden/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.warden/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.warden/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.warden/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.warden/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001award\"/" $HOME/.warden/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.warden/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.warden/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/wardend.service > /dev/null <<EOF
[Unit]
Description=warden-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which wardend) start --home $HOME/.warden
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable wardend && sudo systemctl start wardend && sudo journalctl -fu wardend -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/warden_auto)
```

  </TabItem>
</Tabs>
