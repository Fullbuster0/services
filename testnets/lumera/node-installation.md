---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-lumera">
# Lumera Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `lumera-testnet-2` | Node Version: `v1.6.0` | Custom Port: `40`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export LUMERA_CHAIN_ID="lumera-testnet-2"" >> $HOME/.bash_profile
echo "export LUMERA_PORT="40"" >> $HOME/.bash_profile
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
wget https://github.com/LumeraProtocol/lumera/releases/download/v1.6.0/lumera_v1.6.0_linux_amd64.tar.gz
tar -xvf lumera_v1.6.0_linux_amd64.tar.gz
rm lumera_v1.6.0_linux_amd64.tar.gz
rm install.sh
sudo mv libwasmvm.x86_64.so /usr/lib/
chmod +x lumerad
mv lumerad $HOME/go/bin/
```

### Initialize The Node

```bash
lumerad init $MONIKER --chain-id $LUMERA_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "lumera-testnet-2"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:40657"|' \
  $HOME/.lumera/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.lumera/config/genesis.json https://files.shazoes.xyz/testnets/lumera/genesis.json
wget -O $HOME/.lumera/config/addrbook.json https://files.shazoes.xyz/testnets/lumera/addrbook.json
wget -O $HOME/.lumera/config/claims.csv https://files.shazoes.xyz/testnets/lumera/claims.csv
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="ee7b29ce2ef3c7d18a58dc96ab9e6516755bfa0f@65.108.131.104:30756,8d7557e2e4e8c5d3b409663764d9fdc22d2c3449@44.204.100.172:26656,4ee99f2039eee00535e2197f77cfd23f61803cc0@66.129.102.28:26656,7afeb06db4edc7e7a6c018909876808408c4d1d7@148.113.165.128:56416,7c37a7eb1292b432a8f98ba40d32cb3dd4b3beeb@164.132.247.253:56416,3e00e110111612ac9c3d93b6ba75796c82a7bd1d@141.94.141.165:26856,7f0c7ae8eae8108cc8ed6dbc66efd16f9676bac9@3.218.250.158:26656,54bb17ce612313b941ec6aee00413d6a08032e69@64.203.83.66:26656,5e8af106ab8273479eaf76c81ceef6fcd0a42555@152.53.110.139:63656,c03fce64f173d50a6b98309658d43bb3fa09ae17@65.109.120.211:36656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.lumera/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${LUMERA_PORT}317%g;
s%:8080%:${LUMERA_PORT}080%g;
s%:9090%:${LUMERA_PORT}090%g;
s%:9091%:${LUMERA_PORT}091%g;
s%:8545%:${LUMERA_PORT}545%g;
s%:8546%:${LUMERA_PORT}546%g;
s%:6065%:${LUMERA_PORT}065%g" $HOME/.lumera/config/app.toml
sed -i.bak -e "s%:26658%:${LUMERA_PORT}658%g;
s%:26657%:${LUMERA_PORT}657%g;
s%:6060%:${LUMERA_PORT}060%g;
s%:26656%:${LUMERA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${LUMERA_PORT}656\"%;
s%:26660%:${LUMERA_PORT}660%g" $HOME/.lumera/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.lumera/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.lumera/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.lumera/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.lumera/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.025ulume\"/" $HOME/.lumera/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.lumera/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.lumera/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/lumerad.service > /dev/null <<EOF
[Unit]
Description=lumera-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which lumerad) start --home $HOME/.lumera
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable lumerad && sudo systemctl start lumerad && sudo journalctl -fu lumerad -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/lumera_auto)
```

  </TabItem>
</Tabs>
