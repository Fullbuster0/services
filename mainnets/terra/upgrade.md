---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-terra">
# Terra Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `phoenix-1` | Node Version: `v2.19.0`
</span>

<UpgradeRemainingBlock
rpc="https://terra-mainnet-rpc.shazoes.xyz"
explorerUrl="https://explorer.shazoes.xyz/terra-mainnet/block"
targetBlock={20060000}

/>

## Manual Upgrade

```js
cd $HOME
rm -rf terra
git clone https://github.com/phoenix-directive/core terra
cd terra
git checkout v2.19.0
make install
sudo systemctl restart terrad && sudo journalctl -fu terrad -o cat
```
