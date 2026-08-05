---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="h1-with-icon icon-cosmoshub">
# CosmosHub Node Installation
</div>
<span className="sub-lines">
Chain ID: `cosmoshub-4` | Node Version: `v25.3.0` | Custom Port: `306`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
note

First You Need Set Variabels

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export COSMOSHUB_CHAIN_ID="cosmoshub-4"" >> $HOME/.bash_profile
echo "export COSMOSHUB_PORT="306"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl clang pkg-config libssl-dev jq build-essential tar wget bsdmainutils git make ncdu gcc git jq htop tmux chrony liblz4-tool fail2ban -y
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

### Download and Build Binaries

```bash
cd $HOME
rm -rf cosmos
git clone https://github.com/cosmos/gaia cosmos
cd cosmos
git checkout v25.3.0
make install
```

### Initialize The Node

```bash
gaiad config node tcp://localhost:${COSMOSHUB_PORT}57
gaiad config chain-id $COSMOSHUB_CHAIN_ID
gaiad init $MONIKER --chain-id $COSMOSHUB_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.gaia/config/genesis.json https://files.shazoes.xyz/mainnets/cosmoshub/genesis.json
wget -O $HOME/.gaia/config/addrbook.json https://files.shazoes.xyz/mainnets/cosmoshub/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="6374a5f0d1317c9f60b4fc6c747dfb1e5691ffea@13.125.196.113:26656,fe68c86e4b111b28c0cb43076c2966d86330a16a@8.234.163.238:26656,ad1f112d051819b8edb3db03999b1a5f506a211a@52.2.138.32:26656,86ec4a84668a8b0d622db0faf505f1a7901efab4@51.68.31.181:26656,48c5af84afc9e25f62a7189f0260fd907aac5f68@204.16.247.246:26656,d9e1182c592a286d16e492a61c4026c79254c7ba@190.2.143.61:26656,1ab8907bfd8cc244269ad9f9e67c37eb87b8d713@178.162.165.240:26656,c720f53ad59ab70a89520abe695d2eef5ced3091@5.61.208.27:26656,ada9cf1afe0fae4395de2281fe816d3c2d067e6e@54.251.217.58:26656,f98ee2b7bc69bcedd19aa4880a4dc89482555863@65.109.58.158:14956,7811f5d3c9fc519ed0d100ba360372dcd68e9b8e@65.108.43.178:26656,ff769ecff2eea4645b03ff198db7180fd560c98c@103.216.190.218:26656,ca11babf3b375eac4e91dcdc27314fc159cb40af@118.201.111.138:26656,ca92abdc4599dd91dd63e689c64c468df5425f2c@95.216.100.99:13456,97a022a776f75a08217d83f3b5ff8147cf4594ac@94.242.198.81:26656,63f1915e9d052a04cb11243bb90ff67879dd972c@141.98.219.28:26656,11e959e8c64963390f49948b6332a854a94d1921@34.195.124.95:26656,caa5b5ec072ee3e410db3eeaf0e83519970f7106@148.113.208.142:26356,36ad7bacc3a18b4deb647c60a0c1d8bbd24fde39@82.113.25.131:26656,51ec204cb5925e473f7f223551a35fb28ce6c90e@168.119.73.176:57657,a2b597319a122d50d90ed3c15c077f0af8388311@72.38.77.162:26656,86338a6f56c50f3c6f9462c76df16c6aff8718df@67.217.56.190:13456,11e837135201ce363f09cb951e9dff96ee47cd23@43.167.156.54:26656,cbc6e2c364fec853fc74f01d4926c6046d9b2067@95.216.98.122:34656,fd44480fffcca5bc1d7b8185a35472de58155330@198.244.253.126:30762"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.gaia/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${COSMOSHUB_PORT}17%g;
s%:8080%:${COSMOSHUB_PORT}80%g;
s%:9090%:${COSMOSHUB_PORT}90%g;
s%:9091%:${COSMOSHUB_PORT}91%g;
s%:8545%:${COSMOSHUB_PORT}45%g;
s%:8546%:${COSMOSHUB_PORT}46%g;
s%:6065%:${COSMOSHUB_PORT}65%g" $HOME/.gaia/config/app.toml
sed -i.bak -e "s%:26658%:${COSMOSHUB_PORT}58%g;
s%:26657%:${COSMOSHUB_PORT}57%g;
s%:6060%:${COSMOSHUB_PORT}60%g;
s%:26656%:${COSMOSHUB_PORT}56%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${COSMOSHUB_PORT}56\"%;
s%:26660%:${COSMOSHUB_PORT}60%g" $HOME/.gaia/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.gaia/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.gaia/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.gaia/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.gaia/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.005uatom\"/" $HOME/.gaia/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.gaia/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.gaia/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/gaiad.service > /dev/null <<EOF
[Unit]
Description=cosmoshub-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which gaiad) start --home $HOME/.gaia
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable gaiad && sudo systemctl start gaiad && sudo journalctl -fu gaiad -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/cosmoshub_auto)
```

  </TabItem>
</Tabs>
