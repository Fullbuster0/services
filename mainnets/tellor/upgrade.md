---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-tellor">
# Tellor Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `tellor-1` | Node Version: `v5.1.1`
</span>

<!-- <UpgradeRemainingBlock
rpc="https://tellor-mainnet-rpc.shazoes.xyz"
explorerUrl="https://explorer.shazoes.xyz/tellor-mainnet/block"
targetBlock={1056500}

/> -->

## Manual Upgrade

```js
cd $HOME
curl -LO https://github.com/tellor-io/layer/releases/download/v5.1.2/layer_Linux_x86_64.tar.gz
tar -xvf layer_Linux_x86_64.tar.gz
rm layer_Linux_x86_64.tar.gz
chmod +x layerd
mv layerd $HOME/go/bin
sudo systemctl restart layerd && sudo journalctl -fu layerd -o cat
```
