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

<div className="h1-with-icon icon-warden">
# Warden Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `barra_9191-1` | Node Version: `v0.7.0-rc3` | Custom Port: `29`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export WARDEN_CHAIN_ID="barra_9191-1"" >> $HOME/.bash_profile
echo "export WARDEN_PORT="29"" >> $HOME/.bash_profile
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
VER="1.25.2"
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
wget -O wardend https://github.com/warden-protocol/wardenprotocol/releases/download/v0.7.0-rc3/wardend-v0.7.0-rc3-linux-amd64
chmod +x wardend
mv wardend $HOME/go/bin
```

### Initialize The Node

```bash
wardend init $MONIKER --chain-id $WARDEN_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "barra_9191-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:29657"|' \
  $HOME/.warden/config/client.toml
```

### Configure app.toml and config.toml

```bash
cd $HOME/.warden/config
sed -i.bak 's|^\s*minimum-gas-prices\s*=.*|minimum-gas-prices = "10award"|' app.toml
sed -i.bak 's|^\s*evm-chain-id\s*=.*|evm-chain-id = 9191|' app.toml
sed -i.bak 's|^\s*chain-id\s*=.*|chain-id = "barra_9191-1"|' client.toml
sed -i.bak 's|^\s*seeds\s*=.*|seeds = "c489c003b7c72298840bd4411ffc98ce13e07c27@54.194.136.183:26656,4564c91423a923eaba7982e69e33aec6185d362f@54.72.5.234:26656"|' config.toml
sed -i.bak 's|^\s*timeout_propose\s*=.*|timeout_propose = "1s"|' config.toml
sed -i.bak 's|^\s*timeout_propose_delta\s*=.*|timeout_propose_delta = "200ms"|' config.toml
sed -i.bak 's|^\s*timeout_prevote\s*=.*|timeout_prevote = "500ms"|' config.toml
sed -i.bak 's|^\s*timeout_prevote_delta\s*=.*|timeout_prevote_delta = "200ms"|' config.toml
sed -i.bak 's|^\s*timeout_precommit\s*=.*|timeout_precommit = "500ms"|' config.toml
sed -i.bak 's|^\s*timeout_precommit_delta\s*=.*|timeout_precommit_delta = "200ms"|' config.toml
sed -i.bak 's|^\s*timeout_commit\s*=.*|timeout_commit = "2s"|' config.toml
sed -i.bak 's|^\s*create_empty_blocks\s*=.*|create_empty_blocks = true|' config.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.warden/config/genesis.json https://files.shazoes.xyz/testnets/warden/genesis.json
wget -O $HOME/.warden/config/addrbook.json https://files.shazoes.xyz/testnets/warden/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="a073ca67b879785714fbced8d91c254aa475c1f7@warden-testnet-rpc.shazoes.xyz:29656,a416f0a5a925a3cd40ceb166aeab43e71748c1dc@95.217.109.206:11956,9c7564f341a9ac63217b7bc8f1de65cbecb09f55@188.40.66.173:27356,c489c003b7c72298840bd4411ffc98ce13e07c27@54.194.136.183:26656,4564c91423a923eaba7982e69e33aec6185d362f@54.72.5.234:26656,30b1384f9f4ae8a1644dabb92ad4715a8b155404@51.79.78.121:26656,fb3c995373c0feee597dd3ed32e56cb5e0f0d1c2@65.108.120.161:26726,92bf4175907fe1348820595c2c01db411304ec62@135.181.59.112:12756,6089ea41e8003ebf81e22f1f78d7558c5e20b302@144.76.29.90:61256"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.warden/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${WARDEN_PORT}317%g;
s%:8080%:${WARDEN_PORT}080%g;
s%:9090%:${WARDEN_PORT}090%g;
s%:9091%:${WARDEN_PORT}091%g;
s%:8545%:${WARDEN_PORT}545%g;
s%:8546%:${WARDEN_PORT}546%g;
s%:6065%:${WARDEN_PORT}065%g" $HOME/.warden/config/app.toml
sed -i.bak -e "s%:26658%:${WARDEN_PORT}658%g;
s%:26657%:${WARDEN_PORT}657%g;
s%:6060%:${WARDEN_PORT}060%g;
s%:26656%:${WARDEN_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${WARDEN_PORT}656\"%;
s%:26660%:${WARDEN_PORT}660%g" $HOME/.warden/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.warden/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.warden/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.warden/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.warden/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"10award\"/" $HOME/.warden/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.warden/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.warden/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/wardend.service > /dev/null <<EOF
[Unit]
Description=warden-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which wardend) start --home $HOME/.warden
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable wardend && sudo systemctl start wardend && sudo journalctl -fu wardend -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/warden_auto)
```

  </TabItem>
</Tabs>
