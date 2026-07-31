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

<div className="h1-with-icon icon-fuel">
# Fuel Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `seq-mainnet-1` | Node Version: `seq-mainnet-1.2` | Custom Port: `14`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export FUEL_CHAIN_ID="seq-mainnet-1"" >> $HOME/.bash_profile
echo "export FUEL_PORT="14"" >> $HOME/.bash_profile
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
wget -O fuelsequencerd https://github.com/FuelLabs/fuel-sequencer-deployments/releases/download/seq-mainnet-1.2-improved-sidecar/fuelsequencerd-seq-mainnet-1.2-improved-sidecar-linux-amd64
chmod +x fuelsequencerd
mv $HOME/fuelsequencerd $HOME/go/bin/
```

### Initialize The Node

```bash
fuelsequencerd init $MONIKER --chain-id $FUEL_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "seq-mainnet-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:14657"|' \
  $HOME/.fuelsequencer/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.fuelsequencer/config/genesis.json https://files.shazoes.xyz/mainnets/fuel/genesis.json
wget -O $HOME/.fuelsequencer/config/addrbook.json https://files.shazoes.xyz/mainnets/fuel/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="1d74e8049fdc35ec5a8d26d058a06b642c0adf6a@74.50.67.222:26858,0fd7064ac6b984aa648a69d68c65e3f498668780@8.244.153.12:63656,540efd57749223b1400475e121addbddca972916@185.107.68.176:26656,1b6753264d5939f78bf365c867781be61f3efc9e@185.246.84.125:26656,478d6a599ac3e2b93a3622a635c378804b26975a@162.19.83.215:58456,445952b74b508ba5915f3c2f0a8d169a409f174b@57.129.64.92:26656,fc5fd264190e4a78612ec589994646268b81f14e@80.64.208.207:26656,dc7b01b0379f660fb59223b9862cef0db11f14d9@152.53.121.42:19656,c0a07e7942ed5482cfd1cfbfe0bfce76db0dcc9c@221.148.45.118:27656,d87dfe68db586fecc1141b0de687cbd72f1e131e@207.180.215.245:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.fuelsequencer/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${FUEL_PORT}317%g;
s%:8080%:${FUEL_PORT}080%g;
s%:9090%:${FUEL_PORT}090%g;
s%:9091%:${FUEL_PORT}091%g;
s%:8545%:${FUEL_PORT}545%g;
s%:8546%:${FUEL_PORT}546%g;
s%:6065%:${FUEL_PORT}065%g" $HOME/.fuelsequencer/config/app.toml
sed -i.bak -e "s%:26658%:${FUEL_PORT}658%g;
s%:26657%:${FUEL_PORT}657%g;
s%:6060%:${FUEL_PORT}060%g;
s%:26656%:${FUEL_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${FUEL_PORT}656\"%;
s%:26660%:${FUEL_PORT}660%g" $HOME/.fuelsequencer/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.fuelsequencer/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.fuelsequencer/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.fuelsequencer/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.fuelsequencer/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"10fuel\"/" $HOME/.fuelsequencer/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.fuelsequencer/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.fuelsequencer/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/fuelsequencerd.service > /dev/null <<EOF
[Unit]
Description=fuel-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which fuelsequencerd) start --home $HOME/.fuelsequencer
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable fuelsequencerd && sudo systemctl start fuelsequencerd && sudo journalctl -fu fuelsequencerd -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/fuel_auto)
```

  </TabItem>
</Tabs>
