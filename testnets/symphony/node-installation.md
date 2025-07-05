---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-symphony">
# Symphony Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `symphony-testnet-4` | Node Version: `v5testnet` | Custom Port: `27`
</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SYMPHONY_CHAIN_ID="symphony-testnet-4"" >> $HOME/.bash_profile
echo "export SYMPHONY_PORT="27"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### Install dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl clang pkg-config libssl-dev jq build-essential tar wget  bsdmainutils git make ncdu gcc git jq htop tmux chrony liblz4-tool fail2ban -y
```

### Install GO

```bash
cd $HOME
VER="1.22.4"
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

### Download and build binaries

```bash
cd $HOME
rm -rf symphony
git clone https://github.com/Orchestra-Labs/symphony.git
cd symphony
git checkout fix/change-upgrade-name-to-fix-testnet-migration
make install
```

### Initialize The Node

```bash
symphonyd config node tcp://localhost:${SYMPHONY_PORT}657
symphonyd config chain-id $SYMPHONY_CHAIN_ID
symphonyd config keyring-backend test
symphonyd init $MONIKER --chain-id $SYMPHONY_CHAIN_ID
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.symphonyd/config/genesis.json https://files.shazoes.xyz/testnets/symphony/genesis.json
wget -O $HOME/.symphonyd/config/addrbook.json https://files.shazoes.xyz/testnets/symphony/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="4a92ad0f35afdb1df34bca49d2f21ca76f44edcd@65.21.67.40:31656,02108317e4a4878148735210721a64f89b147350@65.21.196.57:35656,d6a780caa80c783ae21c2ade96e1911c40383587@185.232.70.33:16656,bb07306c8861a418a2f4048cb1101e7a3a30e55c@176.9.113.61:36656,0654e74ef51697b400ceff9a16af9e15bfe42a72@46.4.91.76:29256,f21a0c449aa40052ab7780b073b1ecd387614eb9@65.108.129.49:38656,61771badcaff0ec79f16209a4a03a60fd6739dca@91.227.33.18:20656,ccbeb8d2f5a9b4a2d9b9da1b90ef9c85ba1d6b79@38.97.60.3:23656,12174ce319b00e579d4eb468cbb4d22bc1bd2325@65.109.117.113:29256,5f54b4547e9e3d67d039035716f2b782aa4044bf@65.109.83.40:29256,930848a35a0a5cb09948e278a2725202b689972e@116.202.150.231:12156,ce805612828bc6467fe6081c75bba1a917dc3106@109.123.247.208:35656,662e5d18365ff192c15a0a2562c1f5c0d7f5c589@65.109.30.35:35656,06655689b061c8dd02dbc7e879720cf55d36f770@65.21.141.250:35656,7c7510f57c86c038caa8b0105b5e2ae61877aa39@88.198.5.77:39656,b8d7d41577ccc95a2ec021af0535bdbbf92e4896@149.50.116.91:35656,683d80f56e9aad9caae030c218309b2e2cc15b7f@185.227.135.165:26656,b0d642c26f5d146020e91a8b41a5f55c121bcafc@149.50.116.116:31656,c4b1d93bcbdad1dd391d33e29dbcb879cdcf41d4@135.181.228.89:35656,ef8220abe47df52891b01758fd74645dc0a0bb83@116.202.32.209:26656,f5106a86b004fd48cd962a57659446ac80be9bf1@65.109.123.185:35656,673dcb5c91dc508d260f30f9eec167c8cb0e9118@195.3.223.119:27656,3b068f0a8e1065de9cbb8ce7eaefed9db4585d55@142.132.209.118:21656,60015d3ddd3bda98569121e7c02b8148ef8bb672@144.217.68.182:14556,d30babe97cbff419ad9a913744f92591c1ceeff0@45.140.146.212:26656,6ec88d52db29d6c64cbbebebd41a381245e4730f@65.108.199.62:12156,fb7df1cf347d45bd14d89ee549aa9f0c1291d3c7@152.53.84.199:35656,1fac066a1751be7c6c8141f897c67f319b3fcae2@74.241.130.41:31056,8e5d8b822c67b9e60f884857c2b58af95e1c67be@152.53.19.64:14656,d12d329f478f5172abf47bef3c8829cd776567dd@65.109.27.148:35656,897e128f19a8d0c10de7c5efc9086e1ed60b086b@135.181.0.97:35656,41d1a5b74970c1823cb1a3be3367ce5cdbe76e4e@135.181.210.46:51656,8713c8dd97c45d4d6c069c76d99ea0f64a8f3752@65.109.154.9:29156,a8dd994eea42c0cd9452e74f492e7fe8e5493dd2@195.201.194.231:26656,6baaa9a3775a97a06e160f2ecc7cc9db38f31bf8@152.53.229.82:26656,bd980568469c8c0e8c5fd0f8adcbbbe94ddd041a@135.181.79.242:35656,dd96b135e54de85ccdca1cdcb644bcd828ece8d5@167.114.118.199:26656,1267e57e1f5ce4a6688d703f02fc5f59b7717570@157.245.136.18:26656,64eba2ad436e933b0fff5d758320096904b042b6@103.129.172.245:51556,3bad680d3eebdf0e9168ad5802e2611c95eab124@195.201.197.246:27656,ec008baba8af10eb5c33b8787302e1e513c74f62@14.167.155.152:20656,df754507ff1b7d906647754c40e808d4bfbcce39@88.99.149.170:21656,ea6ca01e0d272d5f7c88a071cf74c61e7c8eafca@152.53.1.122:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.symphonyd/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${SYMPHONY_PORT}317%g;
s%:8080%:${SYMPHONY_PORT}080%g;
s%:9090%:${SYMPHONY_PORT}090%g;
s%:9091%:${SYMPHONY_PORT}091%g;
s%:8545%:${SYMPHONY_PORT}545%g;
s%:8546%:${SYMPHONY_PORT}546%g;
s%:6065%:${SYMPHONY_PORT}065%g" $HOME/.symphonyd/config/app.toml
sed -i.bak -e "s%:26658%:${SYMPHONY_PORT}658%g;
s%:26657%:${SYMPHONY_PORT}657%g;
s%:6060%:${SYMPHONY_PORT}060%g;
s%:26656%:${SYMPHONY_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${SYMPHONY_PORT}656\"%;
s%:26660%:${SYMPHONY_PORT}660%g" $HOME/.symphonyd/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.symphonyd/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.symphonyd/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.symphonyd/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.symphonyd/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0001note\"/" $HOME/.symphonyd/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.symphonyd/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.symphonyd/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/symphonyd.service > /dev/null <<EOF
[Unit]
Description=symphony-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which symphonyd) start --home $HOME/.symphonyd
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable symphonyd && sudo systemctl start symphonyd && sudo journalctl -fu symphonyd -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/symphony_auto)
```

  </TabItem>
</Tabs>
