---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-zetachain">
# Zetachain Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `zetachain_7000-1` | Node Version: `v32` | Custom Port: `311`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export ZETA_CHAIN_ID="zetachain_7000-1"" >> $HOME/.bash_profile
echo "export ZETA_PORT="311"" >> $HOME/.bash_profile
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
VER="1.25.5"
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
wget -O $HOME/zetacored https://github.com/zeta-chain/node/releases/download/v36.0.0/zetacored-linux-amd64
chmod +x $HOME/zetacored
mv $HOME/zetacored $HOME/go/bin
zetacored version
```

### Initialize The Node

```bash
zetacored init $MONIKER --chain-id $ZETA_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "zetachain_7000-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:31157"|' \
  $HOME/.zetacored/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.zetacored/config/genesis.json https://files.shazoes.xyz/mainnets/zetachain/genesis.json
wget -O $HOME/.zetacored/config/addrbook.json https://files.shazoes.xyz/mainnets/zetachain/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="24ec0bb556800b8a8c1ff5c97993fbf7765377a9@zetachain-mainnet-rpc.shazoes.xyz:31156,72da7873feafa8abcb7f53f5b870abefc35b5431@88.99.68.249:22556,af8c2a64f121a0fbffe731eaf036b0f921ed36c9@65.109.48.230:32003,d055168f4afe65bbecb951ed1158307ce5b98cc2@95.217.141.114:22556,f9e0ea944362101cf56b424bf62e2f2bb24d946c@145.239.146.45:22556,9dc398c169ce93ef20dceb4bec48d75419b7ffe6@46.4.99.152:21850,e5ebdc30959a5cbb2b7898995ac8489fd91e3d6e@64.185.227.202:31850,967991134f32eb558cae3e4c5f8bd9adbd599177@52.79.168.185:26656,519d5b9f3ac4a0830ecdb1655eabf63e2217e8ae@40.160.16.84:26656,a6c1f55d027e00205386b24e932eb11c0b77de1c@144.76.98.185:31850,d9fff938cf9a3bc11e0da8a1592e84008ef70977@50.115.46.18:31850"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.zetacored/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${ZETA_PORT}317%g;
s%:8080%:${ZETA_PORT}080%g;
s%:9090%:${ZETA_PORT}090%g;
s%:9091%:${ZETA_PORT}091%g;
s%:8545%:${ZETA_PORT}545%g;
s%:8546%:${ZETA_PORT}546%g;
s%:6065%:${ZETA_PORT}065%g" $HOME/.zetacored/config/app.toml
sed -i.bak -e "s%:26658%:${ZETA_PORT}658%g;
s%:26657%:${ZETA_PORT}657%g;
s%:6060%:${ZETA_PORT}060%g;
s%:26656%:${ZETA_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${ZETA_PORT}656\"%;
s%:26660%:${ZETA_PORT}660%g" $HOME/.zetacored/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.zetacored/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.zetacored/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.zetacored/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.zetacored/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"20000000000azeta\"/" $HOME/.zetacored/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.zetacored/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.zetacored/config/config.toml
```

### Download Snapshot

```bash
curl https://snapshot.shazoes.xyz/mainnets/snapshot-zetachain.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.zetacored
```

### Set Service File

```bash
sudo tee /etc/systemd/system/zetacored.service > /dev/null <<EOF
[Unit]
Description=zetachain-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which zetacored) start --home $HOME/.zetacored
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable zetacored && sudo systemctl start zetacored && sudo journalctl -fu zetacored -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/zeta_auto)
```

  </TabItem>
</Tabs>
