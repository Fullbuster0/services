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

<div className="h1-with-icon icon-story">
# Story  Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `aeneid` | Node Version: `v1.3.0` | Custom Port: `36`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export STORY_CHAIN_ID="aeneid"" >> $HOME/.bash_profile
echo "export STORY_PORT="36"" >> $HOME/.bash_profile
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

#### Download binary

```bash
cd $HOME
rm -rf story-geth
git clone https://github.com/piplabs/story-geth.git
cd story-geth
git checkout v1.1.0
make geth
mv build/bin/geth  $HOME/go/bin/
[ ! -d "$HOME/.story/story" ] && mkdir -p "$HOME/.story/story"
[ ! -d "$HOME/.story/geth" ] && mkdir -p "$HOME/.story/geth"
```

### Install Story

```bash
cd $HOME
rm -rf story
git clone https://github.com/piplabs/story
cd story
git checkout v1.3.0
go build -o story ./client
mkdir -p $HOME/go/bin/
mv $HOME/story/story $HOME/go/bin/
```

### Initialize The Node

```bash
story init --moniker $MONIKER --network $STORY_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.story/config/genesis.json https://files.shazoes.xyz/testnets/story/genesis.json
wget -O $HOME/.story/config/addrbook.json https://files.shazoes.xyz/testnets/story/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="381b10bd04853b375f9a1d42983a0fbfa753e4aa@37.59.22.162:26656,b66b0df0720b38f9405f8a5c50511365ec621b2a@135.181.181.59:62656,7160dec63da82b56e1ce59a93c057c05e361cf85@135.181.117.37:64656,db6791a8e35dee076de75aebae3c89df8bba3374@65.109.50.22:56656,a8d01e154197d799637eca4f0f369dc215db6b70@144.76.111.9:26656,9d34ab3819aa8baa75589f99138318acfa0045f5@95.217.119.251:30900,5eb1d392045c1159a94bdb49916341ac4a787500@157.180.93.155:52656,34c910cde040e983f076195175ed2fe7d447b486@152.53.102.226:26656,dfb96be7e47cd76762c1dd45a5f76e536be47faa@65.108.45.34:32655,ae49103a54f77effa438978ad8a7ba09b6f20da0@144.76.202.120:35656,311cd3903e25ab85e5a26c44510fbc747ab61760@152.53.87.97:36656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.story/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${STORY_PORT}317%g;
s%:8551%:${STORY_PORT}551%g" $HOME/.story/story/config/story.toml
sed -i.bak -e "s%:26658%:${STORY_PORT}658%g;
s%:26657%:${STORY_PORT}657%g;
s%:26656%:${STORY_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${STORY_PORT}656\"%;
s%:26660%:${STORY_PORT}660%g" $HOME/.story/story/config/config.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.story/story/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.story/story/config/config.toml
```

### Set Geth Servie File

```bash
sudo tee /etc/systemd/system/story-geth.service > /dev/null <<EOF
[Unit]
Description=Story Geth daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/geth --aeneid --syncmode full --http --http.api eth,net,web3,engine --http.vhosts '*' --http.addr 0.0.0.0 --http.port ${STORY_PORT}545 --authrpc.port ${STORY_PORT}551 --ws --ws.api eth,web3,net,txpool --ws.addr 0.0.0.0 --ws.port ${STORY_PORT}546
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Set Story Service File

```bash
sudo tee /etc/systemd/system/story.service > /dev/null <<EOF
[Unit]
Description=Story Service
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/.story/story
ExecStart=$(which story) run

Restart=on-failure
RestartSec=5
LimitNOFILE=65535
[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable story story-geth && sudo systemctl start story story-geth  && sudo journalctl u story -u story-geth -f -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/story_auto)
```

  </TabItem>
</Tabs>
