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
Chain ID: `test11` | Node Version: `chain/topaz` | Custom Port: `42`

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
git checkout chain/topaz
make -C gno.land install.gnoland install.gnokey
echo 'export GNOROOT=$HOME/gno' >> ~/.bashrc
source ~/.bashrc
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
gnoland config set p2p.persistent_peers g19q07ssuafhmg6r7ys7wp7rpc4jxc85cpvdy426@seed-1.topaz.testnets.gno.land:26656,g15k98e65gm8h7fdr3yr4tqn82lvch4a97a3sg3j@seed-2.topaz.testnets.gno.land:26656
gnoland config set p2p.seeds g19q07ssuafhmg6r7ys7wp7rpc4jxc85cpvdy426@seed-1.topaz.testnets.gno.land:26656,g15k98e65gm8h7fdr3yr4tqn82lvch4a97a3sg3j@seed-2.topaz.testnets.gno.land:26656
```

### Download Genesis

```bash
wget -O $HOME/gnoland-data/config/genesis.json https://github.com/gnolang/gno/releases/download/chain/topaz/genesis.json
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
