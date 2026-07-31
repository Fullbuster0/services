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
  <span className="notice-text">Network no longer actively validated · Services docs only</span>
</div>

<div className="h1-with-icon icon-tellor">
# Tellor Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `tellor-1` | Node Version: `v5.1.1` | Custom Port: `305`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export TELLOR_CHAIN_ID="tellor-1"" >> $HOME/.bash_profile
echo "export TELLOR_PORT="305"" >> $HOME/.bash_profile
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
curl -LO https://github.com/tellor-io/layer/releases/download/v5.1.2/layer_Linux_x86_64.tar.gz
tar -xvf layer_Linux_x86_64.tar.gz
rm layer_Linux_x86_64.tar.gz
chmod +x layerd
mv layerd $HOME/go/bin
```

### Initialize The Node

```bash
layerd init $MONIKER --chain-id $TELLOR_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "tellor-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "test"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30557"|' \
  $HOME/.layer/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.layer/config/genesis.json https://files.shazoes.xyz/mainnets/tellor/genesis.json
wget -O $HOME/.layer/config/addrbook.json https://files.shazoes.xyz/mainnets/tellor/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="afcf9c90dc741a3eb55a1c4a34cc17744d65f522@tellor-mainnet-rpc.shazoes.xyz:30556,82a5994bb9b2af5fcbf103df674412777d39326f@135.181.5.232:30856,78d08d7dc0a7a0fdb034e1bc892b07c263c6e052@176.9.113.61:60656,2b8af463a1f0e84aec6e4dbf3126edf3225df85e@13.52.231.70:26656,9358c72aa8be31ce151ef591e6ecf08d25812993@18.143.181.83:26656,f2644778a8a2ca3b55ec65f1b7799d32d4a7098e@54.149.160.93:26656,95e55a6cfb850db8c23e969ddd461eac28b98702@3.91.103.4:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.layer/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${TELLOR_PORT}317%g;
s%:8080%:${TELLOR_PORT}080%g;
s%:9090%:${TELLOR_PORT}090%g;
s%:9091%:${TELLOR_PORT}091%g;
s%:8545%:${TELLOR_PORT}545%g;
s%:8546%:${TELLOR_PORT}546%g;
s%:6065%:${TELLOR_PORT}065%g" $HOME/.layer/config/app.toml
sed -i.bak -e "s%:26658%:${TELLOR_PORT}658%g;
s%:26657%:${TELLOR_PORT}657%g;
s%:6060%:${TELLOR_PORT}060%g;
s%:26656%:${TELLOR_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${TELLOR_PORT}656\"%;
s%:26660%:${TELLOR_PORT}660%g" $HOME/.layer/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.layer/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.layer/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.layer/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.layer/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus

```bash
sed -i 's/minimum-gas-prices =.*/minimum-gas-prices = "0.001loya"/g' $HOME/.layer/config/app.toml
sed -i -e "s/prometheus = false/prometheus = true/" $HOME/.layer/config/config.toml
sed -i -e "s/^indexer *=.*/indexer = \"kv\"/" $HOME/.layer/config/config.toml
sed -i 's/timeout_commit = "5s"/timeout_commit = "1s"/' $HOME/.layer/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/layerd.service > /dev/null <<EOF
[Unit]
Description=tellor-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which layerd) start --api.enable --api.swagger --key-name wallet --keyring-backend test --home $HOME/.layer
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable layerd && sudo systemctl start layerd && sudo journalctl -fu layerd -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/tellor_auto)
```

  </TabItem>
</Tabs>
