---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-lava">
# Lava Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `lava-mainnet-1` | Node Version: `v5.5.1` | Custom Port: `307`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export LAVA_CHAIN_ID="lava-mainnet-1"" >> $HOME/.bash_profile
echo "export LAVA_PORT="307"" >> $HOME/.bash_profile
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
rm -rf lava
git clone https://github.com/lavanet/lava
cd lava
git checkout v1.0.0
make install-all
```

### Initialize The Node

```bash
lavad init $MONIKER --chain-id $LAVA_CHAIN_ID

sed -i \
-e 's/timeout_propose = .*/timeout_propose = "1s"/' \
-e 's/timeout_propose_delta = .*/timeout_propose_delta = "500ms"/' \
-e 's/timeout_prevote = .*/timeout_prevote = "1s"/' \
-e 's/timeout_prevote_delta = .*/timeout_prevote_delta = "500ms"/' \
-e 's/timeout_precommit = .*/timeout_precommit = "500ms"/' \
-e 's/timeout_precommit_delta = .*/timeout_precommit_delta = "1s"/' \
-e 's/timeout_commit = .*/timeout_commit = "15s"/' \
-e 's/^create_empty_blocks = .*/create_empty_blocks = true/' \
-e 's/^create_empty_blocks_interval = .*/create_empty_blocks_interval = "15s"/' \
-e 's/^timeout_broadcast_tx_commit = .*/timeout_broadcast_tx_commit = "151s"/' \
-e 's/skip_timeout_commit = .*/skip_timeout_commit = false/' \
  $HOME/.lava/config/config.toml

sed -i \
  -e 's|^chain-id *=.*|chain-id = "lava-mainnet-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30757"|' \
  $HOME/.lava/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.lava/config/genesis.json https://files.shazoes.xyz/mainnets/lava/genesis.json
wget -O $HOME/.lava/config/addrbook.json https://files.shazoes.xyz/mainnets/lava/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="883e8ced6fc2f1fea0074b8f8a2f3edc612c1a12@lava-mainnet-rpc.shazoes.xyz:30756,839d29381d912fe7d16bd198ab4a774466241d5f@5.9.96.28:7656,5a1f54b549ec61580f648ba2c2e5491089021809@65.109.92.163:10020,94bc6b515853489f13f8e497b5a8652e22d49f73@88.218.224.46:56656,b96f992e06b9193b95fcc1da445bb30c6caf1a8a@144.76.111.245:26656,7d7968e8e37c62b49daa567fb94e170101ae7551@103.241.50.31:26656,f0b1a7171fb7d5990593d5a0675c1e4b9fa5e0f4@65.108.207.225:26656,408ddeb68bd2cc5e6ff1b3ed17ac1e79b70cb356@51.161.172.54:55676,0696338a19213a6b2044fe2c0a99272b14844c85@5.9.116.185:26656,18a80499a523121593c255e5c56d5672d54c32ec@162.19.10.128:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.lava/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${LAVA_PORT}317%g;
s%:8080%:${LAVA_PORT}080%g;
s%:9090%:${LAVA_PORT}090%g;
s%:9091%:${LAVA_PORT}091%g;
s%:8545%:${LAVA_PORT}545%g;
s%:8546%:${LAVA_PORT}546%g;
s%:6065%:${LAVA_PORT}065%g" $HOME/.lava/config/app.toml
sed -i.bak -e "s%:26658%:${LAVA_PORT}658%g;
s%:26657%:${LAVA_PORT}657%g;
s%:6060%:${LAVA_PORT}060%g;
s%:26656%:${LAVA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${LAVA_PORT}656\"%;
s%:26660%:${LAVA_PORT}660%g" $HOME/.lava/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.lava/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.lava/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.lava/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.lava/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.00002ulava\"/" $HOME/.lava/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.lava/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.lava/config/config.toml
```

### Download Snapshot

```bash
curl https://snapshot.shazoes.xyz/mainnets/snapshot-lava.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.lava
```

### Set Service File

```bash
sudo tee /etc/systemd/system/lavad.service > /dev/null <<EOF
[Unit]
Description=lava-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which lavad) start --home $HOME/.lava
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable lavad && sudo systemctl start lavad && sudo journalctl -fu lavad -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/lava_auto)
```

  </TabItem>
</Tabs>
