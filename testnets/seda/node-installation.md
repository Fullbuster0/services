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

<div className="h1-with-icon icon-seda">
# Seda Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `seda-1-testnet` | Node Version: `v1.0.0-rc.4` | Custom Port: `43`
</span>

<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SEDA_CHAIN_ID="seda-1-testnet"" >> $HOME/.bash_profile
echo "export SEDA_PORT="43"" >> $HOME/.bash_profile
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
git clone https://github.com/sedaprotocol/seda-chain.git
cd seda-chain
git checkout v1.0.0-rc.4
make install
```

### Initialize The Node

```bash
sedad init $MONIKER --chain-id $SEDA_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "seda-1-testnet"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:43657"|' \
  $HOME/.sedad/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.sedad/config/genesis.json https://files.shazoes.xyz/testnets/seda/genesis.json
wget -O $HOME/.sedad/config/addrbook.json https://files.shazoes.xyz/testnets/seda/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="d967e409d7353994e43fd5c13191f4c99673d297@5.9.116.21:25856,d84359abdb55f6f7b1caf59c80855955f44bf32b@94.130.35.35:13656,50d00c212df119eb19ab976b40cf3cd149ad50ab@185.183.35.185:26656,a6a6f924bf8a88e2d2d6ace0031e6844951712a9@93.189.30.113:26656,cb75c263cff51a14a4f10694046bb81414d10064@18.171.36.35:26656,e5af5f5c2650fb13da1c661460e72186face79be@95.217.35.179:25856,1c3e338b82bc8ca81e7625609e9f8ef583963143@65.108.105.48:25856,35d1fec5d70b51e90dfa8b5a2368691ebc78b82a@57.128.202.24:26656,945710d8ab3b3c5e4f9474254213bccf09551878@91.223.3.190:56176,1fef9721db7cb37ace237d1a2b1271c319bb1c0c@94.130.164.82:25856,b2693b557e75822c4d02b7344a2d38781ffed780@194.163.135.92:26656,e25298af7d8884992ab5ae14d0d4e1368bee799f@131.153.154.57:26656,c13a5b542acb9af74c866f512eb0b6c88add8134@176.9.0.179:26656,d5519e378247dfb61dfe90652d1fe3e2b3005a5b@65.109.68.190:17356,1027c297a88a37b67906c85099116b8fe0136b0e@135.181.178.120:17656,8cfdbb242658a42a108b64bbdff73216df9a8e7d@51.195.61.9:25856"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.sedad/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${SEDA_PORT}317%g;
s%:8080%:${SEDA_PORT}080%g;
s%:9090%:${SEDA_PORT}090%g;
s%:9091%:${SEDA_PORT}091%g;
s%:8545%:${SEDA_PORT}545%g;
s%:8546%:${SEDA_PORT}546%g;
s%:6065%:${SEDA_PORT}065%g" $HOME/.sedad/config/app.toml
sed -i.bak -e "s%:26658%:${SEDA_PORT}658%g;
s%:26657%:${SEDA_PORT}657%g;
s%:6060%:${SEDA_PORT}060%g;
s%:26656%:${SEDA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${SEDA_PORT}656\"%;
s%:26660%:${SEDA_PORT}660%g" $HOME/.sedad/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.sedad/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.sedad/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.sedad/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.sedad/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"10000000000aseda\"/" $HOME/.sedad/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.sedad/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.sedad/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/sedad.service > /dev/null <<EOF
[Unit]
Description=seda-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which sedad) start --home $HOME/.sedad
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable sedad && sudo systemctl start sedad && sudo journalctl -fu sedad -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/seda_auto)
```

  </TabItem>
</Tabs>
