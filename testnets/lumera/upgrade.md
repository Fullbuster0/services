---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-lumera">
# Lumera Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `lumera-testnet-2` | Node Version: `v1.7.0`
</span>

<UpgradeRemainingBlock
rpc="https://lumera-testnet-rpc.shazoes.xyz"
explorerUrl="https://explorer.shazoes.xyz/lumera-testnet/block"
targetBlock={425000}

/>

## Manual Upgrade

```js
cd $HOME
mkdir download
cd download
cd $HOME
wget https://github.com/LumeraProtocol/lumera/releases/download/v1.7.0/lumera_v1.7.0_linux_amd64.tar.gz
tar -xvf lumera_v1.7.0_linux_amd64.tar.gz
rm lumera_v1.7.0_linux_amd64.tar.gz
rm install.sh
sudo mv libwasmvm.x86_64.so /usr/lib/
chmod +x lumerad
mv lumerad $HOME/go/bin/
sudo systemctl restart lumerad && sudo journalctl -fu lumerad -o cat
```
