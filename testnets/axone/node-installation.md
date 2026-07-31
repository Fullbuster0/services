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

<div className="h1-with-icon icon-axone">
# Axone Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `axone-dentrite-1` | Node Version: `v10.0.0` | Custom Port: `44`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export AXONE_TEST_CHAIN_ID="axone-dentrite-1"" >> $HOME/.bash_profile
echo "export AXONE_TEST_PORT="37"" >> $HOME/.bash_profile
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
rm -rf axoned
git clone https://github.com/axone-protocol/axoned.git
cd axoned
git checkout v10.0.0
make install
```

### Initialize The Node

```bash
axoned init $MONIKER --chain-id $AXONE_TEST_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "axone-dentrite-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:44657"|' \
  $HOME/.axoned/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.axoned/config/genesis.json https://files.shazoes.xyz/testnets/axone/genesis.json
wget -O $HOME/.axoned/config/addrbook.json https://files.shazoes.xyz/testnets/axone/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="548f1a6f8b39d4c2c051e86f03652c71e41c2db1@axone-testnet-rpc.shazoes.xyz:44656,cc0f33ddf3f4e739debf4160aa33e47574257a21@45.159.223.115:27656,4e6133824966c300cf2412b792648f54f7b4eb7d@37.252.186.233:26656,ab93659fbefaa8e5ede54b1abeaa747682aba59e@74.208.16.201:26646,adb5e004b95e6db7041e68af878cf8b8bada0ec3@141.94.143.203:55156,8ea05a621d5fdfbda4192ae8369f289ef04c04ba@78.46.74.23:25656,6e4f7d05d9bfec461eaaf10bc10983759078389f@95.217.200.98:20056,5b0dc6e6a44b60756765d78fa9ad950d50db0b96@65.109.118.169:36656,910e678dbd20955652b8a2942fd173e54d9e95c1@65.21.233.188:17656,c27e8cb52aa588431e39f5c8b32c30850a228b8b@5.9.116.21:20056,65c16104e3ec43cd8996d98f0aa95be3e186373d@65.108.198.145:59656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.axoned/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${AXONE_TEST_PORT}317%g;
s%:8080%:${AXONE_TEST_PORT}080%g;
s%:9090%:${AXONE_TEST_PORT}090%g;
s%:9091%:${AXONE_TEST_PORT}091%g;
s%:8545%:${AXONE_TEST_PORT}545%g;
s%:8546%:${AXONE_TEST_PORT}546%g;
s%:6065%:${AXONE_TEST_PORT}065%g" $HOME/.axoned/config/app.toml
sed -i.bak -e "s%:26658%:${AXONE_TEST_PORT}658%g;
s%:26657%:${AXONE_TEST_PORT}657%g;
s%:6060%:${AXONE_TEST_PORT}060%g;
s%:26656%:${AXONE_TEST_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${AXONE_TEST_PORT}656\"%;
s%:26660%:${AXONE_TEST_PORT}660%g" $HOME/.axoned/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.axoned/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.axoned/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.axoned/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.axoned/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.01uaxone\"/" $HOME/.axoned/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.axoned/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.axoned/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/axoned.service > /dev/null <<EOF
[Unit]
Description=axone-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which axoned) start --home $HOME/.axoned
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable axoned && sudo systemctl start axoned && sudo journalctl -fu axoned -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/axone_auto)
```

  </TabItem>
</Tabs>
