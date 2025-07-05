---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-tacchain">
# Tacchain Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `tacchain_2391-1` | Node Version: `v0.0.11` | Custom Port: `41`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export TAC_CHAIN_ID="tacchain_2391-1"" >> $HOME/.bash_profile
echo "export TAC_PORT="40"" >> $HOME/.bash_profile
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

### Download and build binaries

```bash
cd $HOME
rm -rf tacchain
git clone https://github.com/TacBuild/tacchain
cd tacchain
git checkout v0.0.11
make install
```

### Initialize The Node

```bash
tacchaind init $MONIKER --chain-id $TAC_CHAIN_ID --home $HOME/.tacchaind
sed -i \
  -e 's|^chain-id *=.*|chain-id = "tacchain_2391-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:41657"|' \
  $HOME/.tacchaind/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.tacchaind/config/genesis.json https://files.shazoes.xyz/testnets/tacchain/genesis.json
wget -O $HOME/.tacchaind/config/addrbook.json https://files.shazoes.xyz/testnets/tacchain/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="9c32b3b959a2427bd2aa064f8c9a8efebdad4c23@206.217.210.164:45130,e9c256c67608948b5449b88227de99df0e58dd38@95.217.37.107:59656,6833866cd3efef730e91e46b72e0b8e86bcecb60@95.216.147.118:26656,d0bf8edcf28dfff75d850863f3985f9448661abf@23.92.177.41:45140,974b85109fd486971e8a5a02a75ba474bc44daf2@209.222.101.91:26656,d8ae3f2ad40170a4248e5cf1b1714d214c254a17@173.212.239.147:26656,3518b6ac9a245d53dd67490225ed120e5705854f@193.34.212.80:55656,21551bc301ac6e13bdea0608d2f2a26b0d3708f4@152.53.230.81:55656,ed1d8b92a61e1d94ec8b880a2575f0f87a0350d2@149.50.116.116:59656,5eb72b9bd8ee5d79c8746084ef5b84e4c07c865b@46.4.107.23:32156,762ba69f4892769e8e282e3714b5f5f346a0f8b9@195.189.96.111:60356,143f2b46ca482470065f750c5345dc9b3f624cdd@65.21.221.110:52656,0cde2d373eecf63c9c5e00db62da6ee3661d1247@135.181.139.249:13656,ea2d65ab09e521ba6db24bc3a2350c3bd19e9d53@169.150.240.74:60356,dc34ff359d9dee20357272171523ce44055d1e0d@195.3.223.73:59656,7b4589393e08b89b24c5dc83013ca81764b30547@65.109.18.91:59656,1665f99009d4d6add70408387fb88bb765455305@167.235.178.134:32156,f908f6910acd523d98f0bdddc7fe9be2bb16e616@188.40.66.173:32156,fd50ad445fb4a472d5224f8a33b555fcb48c5f34@65.21.221.109:59656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.tacchaind/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${TAC_PORT}317%g;
s%:8080%:${TAC_PORT}080%g;
s%:9090%:${TAC_PORT}090%g;
s%:9091%:${TAC_PORT}091%g;
s%:8545%:${TAC_PORT}545%g;
s%:8546%:${TAC_PORT}546%g;
s%:6065%:${TAC_PORT}065%g" $HOME/.tacchaind/config/app.toml
sed -i.bak -e "s%:26658%:${TAC_PORT}658%g;
s%:26657%:${TAC_PORT}657%g;
s%:6060%:${TAC_PORT}060%g;
s%:26656%:${TAC_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${TAC_PORT}656\"%;
s%:26660%:${TAC_PORT}660%g" $HOME/.tacchaind/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.tacchaind/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.tacchaind/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.tacchaind/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.tacchaind/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"100000000000utac\"/" $HOME/.tacchaind/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.tacchaind/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.tacchaind/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/tacchaind.service > /dev/null <<EOF
[Unit]
Description=tacchain-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which tacchaind) start --home $HOME/.tacchaind
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable tacchaind && sudo systemctl start tacchaind && sudo journalctl -fu tacchaind -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/tacchain_auto)
```

  </TabItem>
</Tabs>
