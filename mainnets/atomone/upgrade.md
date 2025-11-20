---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-atomone">
# Atomone Upgrade
</div>
<span className="sub-lines"> 
 Chain ID: `atomone-1` | Node Version: `v3.0.3`
</span>

<span> 
Upgrade at height: <a href="https://explorer.shazoes.xyz/atomone-mainnet/block/5902000">5902000</a><i>Please don`t upgrade before the specified height.</i>
</span>

## Manual Upgrade

```js
cd $HOME
rm -rf atomone
git clone https://github.com/atomone-hub/atomone.git
cd atomone
git checkout v3.0.3
make install
sudo systemctl restart atomoned && sudo journalctl -fu atomoned -o cat
```
