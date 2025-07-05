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
# Lumera Protocol Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `lumera-mainnet-1` | Node Version: `v1.5.0` | Custom Port: `303`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export LUMERA_CHAIN_ID="lumera-mainnet-1"" >> $HOME/.bash_profile
echo "export LUMERA_PORT="303"" >> $HOME/.bash_profile
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
wget https://github.com/LumeraProtocol/lumera/releases/download/v1.5.0/lumera_v1.5.0_linux_amd64.tar.gz
tar xzvf lumera_v1.5.0_linux_amd64.tar.gz
rm lumera_v1.5.0_linux_amd64.tar.gz install.sh
chmod +x lumerad
mv lumerad $HOME/go/bin/
sudo mv libwasmvm.x86_64.so /usr/lib/
sudo ldconfig
```

### Initialize The Node

```bash
lumerad init $MONIKER --chain-id $LUMERA_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "lumera-mainnet-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30357"|' \
  $HOME/.lumera/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.lumera/config/genesis.json https://files.shazoes.xyz/mainnets/lumera/genesis.json
wget -O $HOME/.lumera/config/addrbook.json https://files.shazoes.xyz/mainnets/lumera/addrbook.json
wget -O $HOME/.lumera/config/claims.csv https://raw.githubusercontent.com/LumeraProtocol/lumera-networks/refs/heads/master/mainnet/claims.csv
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="277773c00a7f7029775deba6e28532c40b670d16@95.214.55.46:30357,c8e9ab5451951bc8f75cdc0eb81b9cb25571e7df@161.35.221.191:26656,ddd091cecab267b467f9f6167e9268391fc0ec1f@57.128.98.34:20001,,faf9bc564f4d200d741da088731b6b3ba02192aa@65.108.232.93:30756,89757803f40da51678451735445ad40d5b15e059@169.155.45.78:26656,1ef18bb3ed8efee9fb150151cbcdfca438fa9db4@64.185.227.242:30756,ab5b0bafe670543d6f25dea19a264c7da1e50672@65.108.201.240:30756,5b8d4baa4e4c86b94322d452dc66c4bf218cfc95@184.107.244.74:12300,54361f222e87b7dd1cb90973079c44e7e31c03e5@15.235.42.134:12300,2afe400bfe662b915111ec6c1e5fcb0d2c0ba64e@37.27.239.10:26656"
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
Description=lumera-mainnet
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
source <(curl -s https://files.shazoes.xyz/auto/mainnets/lumera_auto)
```

  </TabItem>
</Tabs>
