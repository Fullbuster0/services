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

<div className="h1-with-icon icon-pushchain">
# Push Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `push_42101-1` | Node Version: `v0.0.15` | Custom Port: `44`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export PUSH_TESTNET_CHAIN_ID="push_42101-1"" >> $HOME/.bash_profile
echo "export PUSH_TESTNET_PORT="44"" >> $HOME/.bash_profile
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

### Download and Build Binaries

```bash
cd $HOME
wget https://github.com/pushchain/push-chain-node/releases/download/v0.0.15/push-chain_0.0.15_linux_amd64.tar.gz
tar -xzvf push-chain_0.0.15_linux_amd64.tar.gz
rm -xzvf push-chain_0.0.15_linux_amd64.tar.gz
chmod +x $HOME/bin/pchaind
mv $HOME/bin/pchaind $HOME/go/bin/
```

### Initialize The Node

```bash
pchaind init $MONIKER --chain-id $PUSH_TESTNET_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "push_42101-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:44657"|' \
  $HOME/.pchain/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.pchain/config/genesis.json https://files.shazoes.xyz/testnets/pushchain/genesis.json
wget -O $HOME/.pchain/config/addrbook.json https://files.shazoes.xyz/testnets/pushchain/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="f473ea27e97632907fcab6c6a18ccd4ae3d1f0e0@pushchain-testnet-rpc.shazoes.xyz:44656,7006c65ce5a31b6b24a7192953f51b362350b75b@100.42.180.139:26656,091f9702302427c6b2cc5eb1d5322c1b2e4eb412@152.53.138.4:17656,628fdc3d47beb47fcc5da58746da7a3a7e26330f@154.12.118.238:26656,deda68a955b352bb201ab54422de1ab35db46652@136.113.195.0:26656,d7fe39a89a2ab1d9a8207121c6a1f8e11f79ac97@34.9.151.27:26656,d2a1f2a83858d483ed05c5f094a65d1dd463de78@34.57.236.39:26656,6531c80081c30afe3c4adb57c57721d16a3a405c@148.113.178.57:26656,6751a6539368608a65512d1a4b7ede4a9cd5004f@136.112.142.137:26656,fab943f24e42949c021c8bfd6da2bfd13fce5a38@34.61.62.242:26656,374573900e4365bea5d946dd69c7343e56e4f375@34.72.243.200:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.pchain/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${PUSH_TESTNET_PORT}317%g;
s%:8080%:${PUSH_TESTNET_PORT}080%g;
s%:9090%:${PUSH_TESTNET_PORT}090%g;
s%:9091%:${PUSH_TESTNET_PORT}091%g;
s%:8545%:${PUSH_TESTNET_PORT}545%g;
s%:8546%:${PUSH_TESTNET_PORT}546%g;
s%:6065%:${PUSH_TESTNET_PORT}065%g" $HOME/.pchain/config/app.toml
sed -i.bak -e "s%:26658%:${PUSH_TESTNET_PORT}658%g;
s%:26657%:${PUSH_TESTNET_PORT}657%g;
s%:6060%:${PUSH_TESTNET_PORT}060%g;
s%:26656%:${PUSH_TESTNET_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${PUSH_TESTNET_PORT}656\"%;
s%:26660%:${PUSH_TESTNET_PORT}660%g" $HOME/.pchain/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.pchain/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.pchain/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.pchain/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.pchain/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"2500000000upc\"/" $HOME/.pchain/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.pchain/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.pchain/config/config.toml
```

### Download Snapshot

```bash
curl https://snapshot.shazoes.xyz/testnets/snapshot-pushchain.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.pchain
```

### Set Service File

```bash
sudo tee /etc/systemd/system/pchaind.service > /dev/null <<EOF
[Unit]
Description=pushchain-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which pchaind) start --home $HOME/.pchain
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable pchaind && sudo systemctl start pchaind && sudo journalctl -fu pchaind -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/pushchain_auto)
```

  </TabItem>
</Tabs>
