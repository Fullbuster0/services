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
Chain ID: `cosmoshub-4` | Node Version: `v25.1.0` | Custom Port: `14`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export COSMOSHUB_CHAIN_ID="cosmoshub-4"" >> $HOME/.bash_profile
echo "export COSMOSHUB_PORT="14"" >> $HOME/.bash_profile
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
rm -rf gaia
git clone https://github.com/cosmos/gaia.git
cd gaia
git checkout v25.1.0
make install
```

### Initialize The Node

```bash
gaiad config node tcp://localhost:${COSMOSHUB_PORT}657
gaiad config chain-id $COSMOSHUB_CHAIN_ID
gaiad init $MONIKER --chain-id $COSMOSHUB_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.gaia/config/genesis.json https://snapshots.polkachu.com/genesis/cosmos/genesis.json
wget -O $HOME/.gaia/config/addrbook.json https://snapshots.polkachu.com/addrbook/cosmos/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS="ade4d8bc8cbe014af6ebdf3cb7b1e9ad36f412c0@seeds.polkachu.com:14956"
PEERS=""
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.gaia/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${COSMOSHUB_PORT}317%g;
s%:8080%:${COSMOSHUB_PORT}080%g;
s%:9090%:${COSMOSHUB_PORT}090%g;
s%:9091%:${COSMOSHUB_PORT}091%g;
s%:8545%:${COSMOSHUB_PORT}545%g;
s%:8546%:${COSMOSHUB_PORT}546%g;
s%:6065%:${COSMOSHUB_PORT}065%g" $HOME/.gaia/config/app.toml
sed -i.bak -e "s%:26658%:${COSMOSHUB_PORT}658%g;
s%:26657%:${COSMOSHUB_PORT}657%g;
s%:6060%:${COSMOSHUB_PORT}060%g;
s%:26656%:${COSMOSHUB_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${COSMOSHUB_PORT}656\"%;
s%:26660%:${COSMOSHUB_PORT}660%g" $HOME/.gaia/config/config.toml
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

:::tip
Snapshot / State Sync: see **Sync** page (currently marked **Soon**). Use LivePeers there to bootstrap peers.
:::

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
# Auto install script — Soon
echo "CosmosHub auto installation: Soon"
```

  </TabItem>
</Tabs>
