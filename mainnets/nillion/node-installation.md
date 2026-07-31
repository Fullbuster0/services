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

<div className="h1-with-icon icon-nillion">
# Nillion Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `nillion-1` | Node Version: `v0.2.5` | Custom Port: `308`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export NILLION_CHAIN_ID="nillion-1"" >> $HOME/.bash_profile
echo "export NILLION_PORT="308"" >> $HOME/.bash_profile
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
rm -rf nilchain
git clone https://github.com/NillionNetwork/nilchain.git
cd nilchain
git checkout v0.2.5
make install
```

### Initialize The Node

```bash
nilchaind init $MONIKER --chain-id $NILLION_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "nillion-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30857"|' \
  $HOME/.nillionapp/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.nillionapp/config/genesis.json https://files.shazoes.xyz/mainnets/nillion/genesis.json
wget -O $HOME/.nillionapp/config/addrbook.json https://files.shazoes.xyz/mainnets/nillion/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="cffbd9a931fe474306f210f6b322ab5204d2879d@nillion-mainnet-rpc.shazoes.xyz:30856,bc13626f878d7b83f18628e1489aa69bc05825e2@37.27.127.137:26666,a1589d0253a2857bf6bef6aa4337956fb0bffe6b@65.108.205.121:28156,c123d1d97a4a81e11900e973230c7c3820e36b67@65.109.61.79:28156,c4c6730d6d068f0baae7f71d05405f886cb16596@65.108.77.220:5000,43507292d8a3fe04c4cd5ab063b676c6ef9ad3d5@57.128.74.22:56316,ccf803ae7401f9beca4c86ed42466d531e1d7eb3@185.100.10.141:31321,9da9bd9147db409d1e3c080379d09753c7cc8889@35.214.131.222:26656,51c6eb79186243a86249cf1370b3a96ece54bbff@195.201.202.39:26656,74d07f74ea324c83661fb01874c34914a918ad53@149.50.110.216:26656,28e36e25966cac6ce9d7d9ccc52afb86d44470f6@84.32.32.150:18600,275ff616339bc7a5f242ff63f1d5bdc4061d7828@15.204.96.26:26656,b4a0753efffc6c7704f1f5d22047d5463776ab4f@121.134.209.209:26656,f55f7eb02fa05a02cc4186b028a05a2dc7b71d9d@184.107.185.205:18600,0e5e4dae6f359062d7bd953ecd84d157aa1e271a@185.189.44.205:26656,a8038f2de293de4f28797e1e069bbed858dfb9c6@45.250.252.75:56316,e6af840bddfe0ab8986f40f8e55a3fad5b21eeae@95.217.150.48:28156,cceb2b5e71e0452bca1e3988730ab7262401d158@162.19.97.197:56316,4e2240e775069d7116053fde46c0f8ccd20775db@167.235.22.239:26673,8914b1372a2f7e1b6a1fb0c7c37d6313b78deca9@91.99.129.0:26656,db3660c0a82f8d23b567aa0c8c516042fe25300a@173.231.41.34:26651,b7e7b55f5054455bb023f7caeb88f8e2f442413b@135.181.249.230:26656,4e4bb63259ace50da09443462d14c053f8d3eb0b@78.46.50.53:26673,78e46394365eb9a9e3f42cbfd324015a0f1f6a48@65.21.16.240:28156,499c9a2c3f3f00300db47599ecdbd8d339acc02d@65.21.214.84:28156,4c129f6b8517ed1c7d6d3e7f9e6bc361445120d0@157.180.4.96:56316,81b7fec7f601dbc291513c3c6b71de9f01dc4596@37.27.229.233:26656,c1b30cda900af8ecf94bc4aad16d49a8738b7cc5@135.125.189.222:26656,e6c00ac958e85bb7844ca0afc2d6cba300f599b0@37.187.136.121:18056"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.nillionapp/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${NILLION_PORT}317%g;
s%:8080%:${NILLION_PORT}080%g;
s%:9090%:${NILLION_PORT}090%g;
s%:9091%:${NILLION_PORT}091%g;
s%:8545%:${NILLION_PORT}545%g;
s%:8546%:${NILLION_PORT}546%g;
s%:6065%:${NILLION_PORT}065%g" $HOME/.nillionapp/config/app.toml
sed -i.bak -e "s%:26658%:${NILLION_PORT}658%g;
s%:26657%:${NILLION_PORT}657%g;
s%:6060%:${NILLION_PORT}060%g;
s%:26656%:${NILLION_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${NILLION_PORT}656\"%;
s%:26660%:${NILLION_PORT}660%g" $HOME/.nillionapp/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.nillionapp/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.nillionapp/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.nillionapp/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.nillionapp/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.025unil\"/" $HOME/.nillionapp/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.nillionapp/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.nillionapp/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/nilchaind.service > /dev/null <<EOF
[Unit]
Description=nillion-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which nilchaind) start --home $HOME/.nillionapp
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable nilchaind && sudo systemctl start nilchaind && sudo journalctl -fu nilchaind -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/nillion_auto)
```

  </TabItem>
</Tabs>
