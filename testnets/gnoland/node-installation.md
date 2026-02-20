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
Chain ID: `test11` | Node Version: `chain/test11` | Custom Port: `42`

</span>

<Tabs>

  <TabItem value="manual Installation" label="Manual Installation">

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
rm -rf gno
git clone https://github.com/gnolang/gno.git
cd gno
git checkout chain/test11
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
gnoland config set p2p.persistent_peers g10l8g7l5u0ahysgj0jczkvwdvct506khfrvf2yz@gnolan-testnet-rpc.shazoes.xyz:42656,g1vgvqg94xy8qj23dc8zpw6wns7q0hj9g8mx03ha@gno-core-sen-01.test11.testnets.gno.land:26656
gnoland config set p2p.seeds g10l8g7l5u0ahysgj0jczkvwdvct506khfrvf2yz@gnolan-testnet-rpc.shazoes.xyz:42656,g1vgvqg94xy8qj23dc8zpw6wns7q0hj9g8mx03ha@gno-core-sen-01.test11.testnets.gno.land:26656
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
ExecStart=$(which gnoland) start --genesis $HOME/gnoland-data/config/genesis.json --data-dir $HOME/gnoland-data --skip-genesis-sig-verification
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
