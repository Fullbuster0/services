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

<div className="h1-with-icon icon-union">
# Union Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `union-1` | Node Version: `v1.2.2` | Custom Port: `309`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export UNION_CHAIN_ID="union-1"" >> $HOME/.bash_profile
echo "export UNION_PORT="309"" >> $HOME/.bash_profile
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
wget https://github.com/unionlabs/union/releases/download/uniond%2Fv1.2.2/uniond-release-x86_64-linux
mv uniond-release-x86_64-linux uniond
chmod +x uniond
mv uniond $HOME/go/bin/
uniond version
```

### Initialize The Node

```bash
uniond init $MONIKER --chain-id $UNION_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "union-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30957"|' \
  $HOME/.union/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.union/config/genesis.json https://files.shazoes.xyz/mainnets/union/genesis.json
wget -O $HOME/.union/config/addrbook.json https://files.shazoes.xyz/mainnets/union/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="92252b61bf5b99193a2de4ddd326c3d260d28286@union-mainnet-rpc.shazoes.xyz:30956,2d318979f882046acea037038212ec1995db6390@65.109.58.158:24656,3dc8c8cfc996a9e80a77e0acb85f6ce858e6f8ff@152.53.210.25:30656,3ebf31d59814eb8edbbf3f9afffe7854b89725cf@148.251.245.34:14456,e18a68cddd88701eb38600969fc3ae180a3f7daf@65.108.232.168:18656,62e66380b3632533ef60f6befda96c696f6b046e@135.181.238.225:11256,b38b25a00938d3ed41bbb9a941ae18d5b25f2cd8@65.109.106.211:29656,f49f04e329313e01b8b32f9bdbd3aeff8a10774c@190.2.142.45:26656,04f27ef917d0ca4f8e007ea36fce2e31c98a8c29@184.107.244.74:18700,45e9650c107d712a749579df27a0fdebc54003bb@65.108.205.121:24656,05d21fc08002cc77df24c5718198b5eb872851d5@95.217.204.48:24656,b5082cb8c99b702492c4737dde68e6bbf55c01b7@188.40.85.190:14456,051fc5b615cb37e86ea4dce8d15e39fa14ae4739@66.45.237.130:26656,0889ba91b29b68924cf9ccfaab6614d66ec020ba@64.130.49.141:22256,0e6469210b919827056c36b520c9d8819beae50b@160.250.106.199:22656,ef7f5362f2344016f3c4d64240000f32891ba2df@65.108.2.61:24656,0e89105a11dcdca92a4d5a13221d4604d6e80b62@167.235.184.49:36656,0e92934b0d7ee2735673983534883b2b48367d77@40.160.53.197:26656,fefcba1133813ce05db6f766d3609abc9b9c77b3@46.232.248.39:30656,e611c382712170f9875d7e5d0f5121ced8950dc4@213.136.85.167:27656,56f2b99440b7e7f540c07ca88bc8a87f6386b1d6@65.21.132.31:25656,2a3dc9e7abd028aac54a69b07ed746d45f9a443e@46.37.123.81:26656,f7b4754004b33c67e2d59b443cd030c92e108c96@23.88.6.237:24656,5b5313396dea3a96dcd7e48af1d7666e1c0053c3@57.129.52.107:26656,6c691f8132eedba2f3f4b72e83ff5fa29859f3f2@185.119.118.116:5000,639191009cf9112f2b0ec8bc8f48ebf22b923bdf@116.202.220.238:10056,0968495362c138b46b47bb653da8cff01ffc2a84@213.170.133.18:26656,411be35332eb307887e5ad85696846b869d7269d@65.108.204.209:22656,25558ce3247e3e216f8cb41fb8de819b5fa8d8e1@88.216.198.174:18700,6942fbc227ef76412e09ca434a0974b173d60f6a@216.105.169.42:14456,829c34fc0fc57e67c6d9951181aaf2743eab9f0c@136.243.104.103:13756,f6246db338a132298419121414917940a60a4dbf@65.108.224.166:22656,5929dd8592ef5ad21c5773326e5bf9f6d0d2e7d6@149.248.38.121:26656,d1bbe6960983a637b0b2cc615c341b22e596b609@95.216.243.91:23656,374c74639cf16588ce6bba89cc9649beea5a8925@213.239.221.157:26656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.union/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${UNION_PORT}317%g;
s%:8080%:${UNION_PORT}080%g;
s%:9090%:${UNION_PORT}090%g;
s%:9091%:${UNION_PORT}091%g;
s%:8545%:${UNION_PORT}545%g;
s%:8546%:${UNION_PORT}546%g;
s%:6065%:${UNION_PORT}065%g" $HOME/.union/config/app.toml
sed -i.bak -e "s%:26658%:${UNION_PORT}658%g;
s%:26657%:${UNION_PORT}657%g;
s%:6060%:${UNION_PORT}060%g;
s%:26656%:${UNION_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${UNION_PORT}656\"%;
s%:26660%:${UNION_PORT}660%g" $HOME/.union/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.union/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.union/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.union/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.union/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"100000000au\"/" $HOME/.union/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.union/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.union/config/config.toml
```

### Set Service File

```bash
sudo tee /etc/systemd/system/uniond.service > /dev/null <<EOF
[Unit]
Description=union-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which uniond) start --home $HOME/.union
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable uniond && sudo systemctl start uniond && sudo journalctl -fu uniond -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/union_auto)
```

  </TabItem>
</Tabs>
