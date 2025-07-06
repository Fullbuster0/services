---
hide_table_of_contents: false
title: Node Installation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="h1-with-icon icon-gnoland">
# Gnolan Node Installation
</div>
<span className="sub-lines"> 
Chain ID: `test6` | Node Version: `latest` | Custom Port: `42`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">

### Install dependencies

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

### Download and build binaries

```bash
cd $HOME
git clone https://github.com/gnolang/gno.git
cd gno
git checkout chain/test6
make -C gno.land install.gnoland && make -C contribs/gnogenesis install && make install_gnokey
gnoland --help
```

### Config and Init App

```bash
cd $HOME
gnoland secrets init && gnoland config init
gnoland config set rpc.laddr tcp://0.0.0.0:42657
gnoland config set p2p.laddr tcp://0.0.0.0:42656
gnoland config set moniker Your_Moniker
gnoland config set consensus.peer_gossip_sleep_duration 10ms
gnoland config set consensus.timeout_commit 3s
gnoland config set mempool.size 10000
gnoland config set p2p.flush_throttle_timeout 10ms
gnoland config set p2p.max_num_outbound_peers 40
gnoland config set p2p.persistent_peers g1yjduxd37l9ep4aw2yprs3pveklepwznhu3dd8y@gnoland-testnet-rpc.shazoes.xyz:42656,g1s0x78pl3c2xv2n7hp33lh4jkyqvhg5hlx6huh7@gno-core-sen-1.test6.testnets.gno.land:26656,g1jeta40dllwtrh293498hq0dh0cr3u4gw77h5rc@gno-core-sen-2.test6.testnets.gno.land:26656
gnoland config set p2p.seeds g1yjduxd37l9ep4aw2yprs3pveklepwznhu3dd8y@gnoland-testnet-rpc.shazoes.xyz:42656,g1s0x78pl3c2xv2n7hp33lh4jkyqvhg5hlx6huh7@gno-core-sen-1.test6.testnets.gno.land:26656,g1jeta40dllwtrh293498hq0dh0cr3u4gw77h5rc@gno-core-sen-2.test6.testnets.gno.land:26656
```

### Download Genesis

```bash
wget -O $HOME/gnoland-data/config/genesis.json https://files.shazoes.xyz/testnets/gnoland/genesis.json
```

### Set Service File

```bash
sudo tee /etc/systemd/system/gnoland.service > /dev/null <<EOF
[Unit]
Description=gnoland-testnet
After=network-online.target

[Service]
User=$USER
ExecStart=$(which gnoland) start --genesis $HOME/gnoland-data/config/genesis.json --data-dir $HOME/gnoland-data
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

### Enable Service and Start Node

```bash
sudo systemctl daemon-reload && sudo systemctl enable gnoland && sudo systemctl start gnoland && sudo journalctl -fu gnoland -o cat
```

  </TabItem>

  <TabItem value="auto installation" label="Auto Installation">

```js
source <(curl -s https://files.shazoes.xyz/auto/testnets/gnoland_auto)
```

  </TabItem>
</Tabs>

##

##

### Register

#### Create Wallet

```bash
gnokey add wallet
```

###### make sure you have funds for the next step

#### Set Vars

<span><i>Change ADDRESS, MONIKER, DESCRIPTION</i></span>

```bash
RPC="https://gnoland-testnet-rpc.shazoes.xyz"
ADDRESS="g1xxx..."
MONIKER="from Shazoes"
DESCRIPTION="from Shazoes"
VALOPER=$(gnoland secrets get validator_key | jq -r '.address')
PUBKEY=$(gnoland secrets get validator_key | jq -r '.pub_key')
ACCOUNT_INFO=$(gnokey query -remote $RPC auth/accounts/$ADDRESS)
ACCOUNT_JSON=$(echo "$ACCOUNT_INFO" | sed -n '/^data:/,$p' | sed 's/^data: //')
ACCOUNT_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.account_number')
SEQUENCE_NUMBER=$(echo "$ACCOUNT_JSON" | jq -r '.BaseAccount.sequence')
```

#### Maketx

```bash
gnokey maketx call -pkgpath "gno.land/r/gnoland/valopers" -func "Register" -args $MONIKER -args $DESCRIPTION -args $VALOPER -args $PUBKEY -gas-fee 1000000ugnot -gas-wanted 15000000 -send "" $ADDRESS > call.tx
```

#### Sign tx

```bash
gnokey sign -tx-path call.tx -chainid "test6" -account-number $ACCOUNT_NUMBER -account-sequence $SEQUENCE_NUMBER $ADDRESS
```

```bash
gnokey broadcast -remote $RPC call.tx
```
