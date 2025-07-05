---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `hippo-protocol-1` | Node Version: `v1.0.0` | Custom Port: `302`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export HIPPO_CHAIN_ID="hippo-protocol-1"" >> $HOME/.bash_profile
echo "export HIPPO_PORT="302"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl unzip clang pkg-config libssl-dev jq build-essential tar wget  bsdmainutils git make ncdu gcc git jq htop tmux chrony liblz4-tool fail2ban -y
```

### Install GO

```bash
cd $HOME
VER="1.23.1"
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

### Download and build binaries

```bash
cd $HOME
rm -rf hippo-protocol
git clone https://github.com/hippocrat-dao/hippo-protocol
cd hippo-protocol
git checkout v1.0.0
make install
```

### Initialize The Node

```bash
hippod init $MONIKER --chain-id $HIPPO_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "hippo-protocol-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30257"|' \
  $HOME/.hippo/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.hippo/config/genesis.json https://files.shazoes.xyz/mainnets/hippo/genesis.json
wget -O $HOME/.hippo/config/addrbook.json https://files.shazoes.xyz/mainnets/hippo/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="9f7f3f03e5b69918f6d26ed76bac94c3334a8690@95.214.55.46:30256,d72632794e5fab55c45a903107acba6709268d1f@52.9.123.164:26656,a200300b6be1d08a44b36001ec08f95d5871a2ec@34.21.69.199:26656,34d206b5f8f9f37917c971561424fd40cfd44b2c@65.21.234.111:10656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.hippo/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${HIPPO_PORT}317%g;
s%:8080%:${HIPPO_PORT}080%g;
s%:9090%:${HIPPO_PORT}090%g;
s%:9091%:${HIPPO_PORT}091%g;
s%:8545%:${HIPPO_PORT}545%g;
s%:8546%:${HIPPO_PORT}546%g;
s%:6065%:${HIPPO_PORT}065%g" $HOME/.hippo/config/app.toml
sed -i.bak -e "s%:26658%:${HIPPO_PORT}658%g;
s%:26657%:${HIPPO_PORT}657%g;
s%:6060%:${HIPPO_PORT}060%g;
s%:26656%:${HIPPO_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${HIPPO_PORT}656\"%;
s%:26660%:${HIPPO_PORT}660%g" $HOME/.hippo/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.hippo/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.hippo/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.hippo/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.hippo/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"4000000000000ahp\"/" $HOME/.hippo/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.hippo/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.hippo/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/hippod.service > /dev/null <<EOF
[Unit]
Description=hippo-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which hippod) start --home $HOME/.hippo
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable hippod && sudo systemctl start hippod && sudo journalctl -fu hippod -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/hippo_auto)
```

  </TabItem>
</Tabs>
