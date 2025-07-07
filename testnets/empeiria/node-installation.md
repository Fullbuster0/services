---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-empeiria">
# Empeiria Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `empe-testnet-2` | Node Version: `v0.2.2` | Custom Port: `23`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export EMPE_CHAIN_ID="empe-testnet-2"" >> $HOME/.bash_profile
echo "export EMPE_PORT="23"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl clang pkg-config libssl-dev jq build-essential tar wget  bsdmainutils git make ncdu gcc git jq htop tmux chrony liblz4-tool fail2ban -y
```

### Install GO

```bash
cd $HOME
VER="1.21.13"
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
curl -LO https://github.com/empe-io/empe-chain-releases/raw/master/v0.4.0/emped_v0.4.0_linux_amd64.tar.gz
tar -xvf emped_v0.4.0_linux_amd64.tar.gz
rm emped_v0.4.0_linux_amd64.tar.gz
chmod +x emped
sudo mv emped $HOME/go/bin
```

### Initialize The Node

```bash
emped config node tcp://localhost:${EMPE_PORT}657
emped config chain-id $EMPE_CHAIN_ID
emped config keyring-backend test
emped init $MONIKER --chain-id $EMPE_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.empe-chain/config/genesis.json https://files.shazoes.xyz/testnets/empeiria/genesis.json
wget -O $HOME/.empe-chain/config/addrbook.json https://files.shazoes.xyz/testnets/empeiria/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="03aa072f917ed1b79a14ea2cc660bc3bac787e82@empeiria-testnet-peer.itrocket.net:28656,106b4f4e333bd04d2b93768dace23bae12ebc1b7@65.109.112.148:21156,a9cf0ffdef421d1f4f4a3e1573800f4ee6529773@136.243.13.36:29056,e058f20874c7ddf7d8dc8a6200ff6c7ee66098ba@65.109.93.124:29056,af1bae5ad434fc2188a1ef9bed23398492826896@193.34.212.80:11156,39e8aee22825a7fdf65a664282843ee13849b6f2@162.244.24.82:27656,2db322b41d26559476f929fda51bce06c3db8ba4@65.109.24.155:11256,38ca15d129e9f02ff4164649f1e8ba1325237e7f@194.163.145.153:26656,fec4ba35a0c58c29a101d728a5008370ac6fe7ed@116.202.150.231:28656,78f766310a83b6670023169b93f01d140566db79@65.109.83.40:29056"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.empe-chain/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${EMPE_PORT}317%g;
s%:8080%:${EMPE_PORT}080%g;
s%:9090%:${EMPE_PORT}090%g;
s%:9091%:${EMPE_PORT}091%g;
s%:8545%:${EMPE_PORT}545%g;
s%:8546%:${EMPE_PORT}546%g;
s%:6065%:${EMPE_PORT}065%g" $HOME/.empe-chain/config/app.toml
sed -i.bak -e "s%:26658%:${EMPE_PORT}658%g;
s%:26657%:${EMPE_PORT}657%g;
s%:6060%:${EMPE_PORT}060%g;
s%:26656%:${EMPE_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${EMPE_PORT}656\"%;
s%:26660%:${EMPE_PORT}660%g" $HOME/.empe-chain/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.empe-chain/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.empe-chain/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.empe-chain/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.empe-chain/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001uempe\"/" $HOME/.empe-chain/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.empe-chain/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.empe-chain/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/emped.service > /dev/null <<EOF
[Unit]
Description=empeiria-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which emped) start --home $HOME/.empe-chain
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable emped && sudo systemctl start emped && sudo journalctl -fu emped -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/empeiria_auto)
```

  </TabItem>
</Tabs>
