---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `hippo-protocol-1` | Node Version: `v1.0.1` | Custom Port: `302`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">
:::note

First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export HIPPO_CHAIN_ID="hippo-protocol-1"" >> $HOME/.bash_profile
echo "export HIPPO_PORT="302"" >> $HOME/.bash_profile
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
rm -rf hippo-protocol
git clone https://github.com/hippo-protocol/hippo-protocol
cd hippo-protocol
git checkout v1.0.2
make install
```

### Initialize The Node

```bash
hippod init $MONIKER --chain-id $HIPPO_CHAIN_ID
sed -i \
  -e 's|^chain-id *=.*|chain-id = "hippo-protocol-1"|' \
  -e 's|^keyring-backend *=.*|keyring-backend = "os"|' \
  -e 's|^node *=.*|node = "tcp://localhost:30257"|' \
  $HOME/.hippo/config/client.toml
```

### Download Genesis & Addrbook

```bash
wget -O $HOME/.hippo/config/genesis.json https://files.shazoes.xyz/mainnets/hippo/genesis.json
wget -O $HOME/.hippo/config/addrbook.json https://files.shazoes.xyz/mainnets/hippo/addrbook.json
```

### Configure Seeds and Peers

```bash
SEEDS=""
PEERS="40de6f07821a098bb2a737e0d162a91efc12635f@hippo-mainnet-rpc.shazoes.xyz:30256,d2cd19145dbb45441e07d484fbb2914474e70cec@88.198.46.77:27656,226e23feea1c36eff64b247658304cff45c775d2@75.119.156.36:10156,2e751b3c163134d0404f82a6d9f6115ea04c4da6@135.181.5.232:31856,f8a154551952162acad04ba872b11a09b5c5f568@65.108.205.121:31856,dae3fce4cdb389148ad50921beebe48309f3acb4@213.239.198.181:12656,228d018aba4fa42bf278166cf15e70b5df7fd2e6@54.180.207.159:26656,fce82e1f228cf0660f02717cb80285f42b9efef1@148.113.214.11:18900,34d206b5f8f9f37917c971561424fd40cfd44b2c@65.21.234.111:10656,8558dc25912b21ec13bc0011b2ab3adfe8e2bf40@5.9.99.42:31856,23f1a1906d4f83a01e5626d8b0f876b6a130d1de@184.107.244.74:18900,f94b1ad39835a9ce9fe9f6a83ca528d9be6ba276@149.50.101.137:12556,ea389eb3d9604da072f6f3d1253938a38715c5c5@44.226.74.246:26656,6f6a3a908634b79b6fe7c4988efec2553f188234@23.128.116.127:31856,d47230ba69c96782bb1e19ceea0c01b309bdb403@23.88.6.237:31856,637077d431f618181597706810a65c826524fd74@103.87.58.204:31856"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.hippo/config/config.toml
```

### Set Custom Port

```bash
sed -i.bak -e "s%:1317%:${HIPPO_PORT}317%g;
s%:8080%:${HIPPO_PORT}080%g;
s%:9090%:${HIPPO_PORT}090%g;
s%:9091%:${HIPPO_PORT}091%g;
s%:8545%:${HIPPO_PORT}545%g;
s%:8546%:${HIPPO_PORT}546%g;
s%:6065%:${HIPPO_PORT}065%g" $HOME/.hippo/config/app.toml
sed -i.bak -e "s%:26658%:${HIPPO_PORT}658%g;
s%:26657%:${HIPPO_PORT}657%g;
s%:6060%:${HIPPO_PORT}060%g;
s%:26656%:${HIPPO_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${HIPPO_PORT}656\"%;
s%:26660%:${HIPPO_PORT}660%g" $HOME/.hippo/config/config.toml
```

### Customize Pruning

```bash
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="0"
pruning_interval="10"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.hippo/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.hippo/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.hippo/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.hippo/config/app.toml
```

### Set Minimum Gas Price, Enable Prometheus, and Disable Indexer

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"4000000000000ahp\"/" $HOME/.hippo/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.hippo/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.hippo/config/config.toml
```

### Download Snapshot

```bash
curl https://snapshot1.shazoes.xyz/mainnets/snapshot-hippo.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.hippo
```

### Set Service File

```bash
sudo tee /etc/systemd/system/hippod.service > /dev/null <<EOF
[Unit]
Description=hippo-mainnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which hippod) start --home $HOME/.hippo
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable hippod && sudo systemctl start hippod && sudo journalctl -fu hippod -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/mainnets/hippo_auto)
```

  </TabItem>
</Tabs>
