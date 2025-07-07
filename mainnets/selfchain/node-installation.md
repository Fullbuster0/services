---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-selfchain">
# Selfchain Node Installation
</div>

<span className="sub-lines"> 
Chain ID: `self-1` | Node Version: `v1.0.1` | Custom Port: `8`
</span>

<Tabs>

  <TabItem value="manual installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SELFCHAIN_CHAIN_ID="self-1"" >> $HOME/.bash_profile
echo "export SELFCHAIN_PORT="8"" >> $HOME/.bash_profile
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
rm -rf selfchaind
wget https://files.shazoes.xyz/mainnets/selfchain/selfchaind
chmod +x selfchaind
sudo mv selfchaind $HOME/go/bin
```

### Initialize The Node

```bash
selfchaind config node tcp://localhost:${SELFCHAIN_PORT}657
selfchaind config chain-id $SELFCHAIN_CHAIN_ID
selfchaind init $MONIKER --chain-id $SELFCHAIN_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.selfchain/config/genesis.json https://files.shazoes.xyz/mainnets/selfchain/genesis.json
wget -O $HOME/.selfchain/config/addrbook.json https://files.shazoes.xyz/mainnets/selfchain/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="bed9629cabe40dc42e4ce42f7385436b02ebb7c7@173.234.17.129:26656,473303f1a0dff43121cff9b7a12b5b39a42bc46c@37.27.31.253:26656,c87c1b17045b27fd14b13d7dbb3469a2248cb1f7@95.217.204.58:24356,b844793daeffaedfcdbd5b08688cd10e1859d678@37.120.245.116:26656,12ee3086924cd372f9b246f2fd62f168d8e1956f@35.246.137.252:26656,761ebdb799904dc67497dac749dffa6bf3ffb1f7@51.91.154.241:26656,790544e857cfe673cab570668131aa7ae2be7e5d@178.63.100.102:26656,6ca2f5faaac9eb9515d12e4437dda9f5b92fe75a@185.185.80.16:27656,34c3a8a2955b4d6e5deef15c6b091250f5878afe@18.117.74.150:26656,c597aa118302d417e039e5a81d722422e73c85e1@135.125.67.229:26656,b3d49f5754fef88f26d00855e7317facf4f69e83@34.107.59.232:26656,e9376f40ac2b672e9f2f66ad212f59801d53afe8@178.162.165.193:26656,637077d431f618181597706810a65c826524fd74@5.9.151.56:24356,07291598c904b1a007c95c1ad65726ec89e86957@149.50.96.153:26656,ca615e31000fa4c6d306fe3ef660a9073fd5b841@65.109.57.180:26656,3adb5b75adf8327bb95744d7af6bae500d93f0d7@37.27.58.244:33656,175adb6fbc838fbebd5b5a38c11eb0b281f0e32d@34.159.217.146:26656,9949c2ab29bad0feeab63248ba33be3c695225cd@65.109.124.52:24356,3747951f83396d549af9e6695fff78f8448f560c@5.75.179.6:11356,760e81fb4399f84bb4812910df871dda47a338fc@135.181.57.156:24356,507c41a0e7d0bb49c3fc62fa2fbc489a67686a18@156.59.230.130:26656,57e9f8a2ecc83619b894ffd5ee515c5d16c580f8@100.42.187.8:10156,ec167976c747aaa8b31a3f8fd123cb6cca1f2583@35.242.223.62:26656,4c8b8296e767cf3d67355dba98781ee0348e87ea@144.76.30.94:30056,f888b80b3400c2a9928c9f7be05214cad148b34b@18.179.157.124:26656,0bf3b065ca0c53a49e9bfed6e1a23aa8318e85da@95.217.148.179:30656,a96b7c56cb64c16917a629c9ae0f3b3c0aea584c@34.159.240.168:26656,e9f2bfbf5cddb0a792148dff3f0b3520d3c63a0f@65.109.92.241:3056,2906a1636c70ea29856f3d846a897a97c97ac86f@34.107.92.166:26656,8c748ed54d18f42ad15645f36c149ef9c00f09e3@34.89.135.59:26656,1e8aba6c7d2e33545353d073006ea9815c641158@46.4.64.123:26656,05f4912df9e18205b5707ba8e2374e6d0e9fa95a@162.55.245.254:27656,5fec0f158870a9e82e8a48fed83a78d567fb639a@167.235.12.38:22156,6a3a0db2763d8222d00af55cbbe35824a39c8292@176.9.183.45:34656,c743758973f5543578949228ff623918a4b43c54@165.232.177.11:26656,2f547f93392d7351c74a0d8cae1d44f172cf32e5@64.227.156.23:26656,61f70b8b37b9a0755b95dac7d57a8c2cc45ea4ea@65.109.78.80:24356,9d7dbaa0cb7f28ab8926c738860c18bd6d00aaaf@168.119.75.89:26656,49f5167151225c0355d1135b1856546f9276d74a@213.239.220.52:25656,1b9693077773f2f986191b44169e447e0bb56dcc@185.225.191.108:36656,9e314854602573cd87ee63c66d24326d67c8454c@65.21.198.100:12856,b307b56b94bd3a02fcad5b6904464a391e13cf48@128.199.33.181:26656,f958f4e2d1384514ed8c62b1bc753d0b8a8d0430@167.235.102.45:24656,9512a59cf93b987aff830148421a514cacb8a1b8@170.64.141.15:26656,6ae10267d8581414b37553655be22297b2f92087@174.138.25.159:26656,7bad33a03bec7c0bd174a386045d5ff583b39570@95.216.7.84:36656,8b550eaf0d044d5234c1b78d0e7cbe6dbe7933e1@198.7.123.210:11356,cf97538e0ba73bff425d48251dbcdc88634d995f@65.108.193.26:20656,597482f116437fef43d401de88df976e53056511@51.77.54.5:26696,4fe1c6741fa525a7462375025aeef42039246cc1@35.246.171.68:26656,eeb793482d2957e760b65c37978ad5ba3528bbd9@65.108.66.174:41656,98b377f4ddc9031ced40cf7685e6ac4ac1f95dae@142.132.248.214:26656,7efdc46e50e03e1f1208c8f276047b7fea345cc8@35.246.252.172:26656,7a9038d1efd34c7f3baea17d8822262a981568b1@217.182.136.79:30156,c139f537755d5614a3ceaeb0f01b03be94e7ecb5@162.19.171.121:26656,c148030a2effe2cfd01e57090647ac5935f4398f@23.105.164.129:26656,0a67ac1518c816e1927554dfc17c47f4ee457bcb@168.119.75.88:36656,5394c55f1bad5cf011d0f43901cc9ad2a1a727e7@95.217.128.197:26656,5bfe7ec3ce0fbbf6d724dc85edef31c23b0a5e5e@94.130.138.48:41656,7f75c0e8a7f5f60b587f4acd805f871445367b4b@37.27.129.24:11656,52130bea53e3286292fcbf6753f6f57f3b40e138@65.108.232.168:12656,923758c6f7adaec3c9a668dc74ba28fda7066b1c@65.109.120.211:24656,bbfa092023e4fbe6b90abe19449bce3cc1c83594@113.176.163.161:26656,08bc9afd0cac4ae6cf8f1877920b0cc7e58a6f42@65.109.99.157:40009"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.selfchain/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${SELFCHAIN_PORT}317%g;
s%:8080%:${SELFCHAIN_PORT}080%g;
s%:9090%:${SELFCHAIN_PORT}090%g;
s%:9091%:${SELFCHAIN_PORT}091%g;
s%:8545%:${SELFCHAIN_PORT}545%g;
s%:8546%:${SELFCHAIN_PORT}546%g;
s%:6065%:${SELFCHAIN_PORT}065%g" $HOME/.selfchain/config/app.toml
sed -i.bak -e "s%:26658%:${SELFCHAIN_PORT}658%g;
s%:26657%:${SELFCHAIN_PORT}657%g;
s%:6060%:${SELFCHAIN_PORT}060%g;
s%:26656%:${SELFCHAIN_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${SELFCHAIN_PORT}656\"%;
s%:26660%:${SELFCHAIN_PORT}660%g" $HOME/.selfchain/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.selfchain/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.selfchain/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.selfchain/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.selfchain/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001uslf\"/" $HOME/.selfchain/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.selfchain/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.selfchain/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/selfchaind.service > /dev/null <<EOF
[Unit]
Description=selfchain-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which selfchaind) start --home $HOME/.selfchain
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable selfchaind && sudo systemctl start selfchaind && sudo journalctl -fu selfchaind -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/selfchain_auto)
```

  </TabItem>
</Tabs>
