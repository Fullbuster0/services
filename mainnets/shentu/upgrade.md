---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-shentu">
# Shentu Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `shentu-2.2` | Node Version: `v2.17.0`
</span>

<UpgradeRemainingBlock
rpc="https://shentu-mainnet-rpc.shazoes.xyz"
explorerUrl="https://explorer.shazoes.xyz/shentu-mainnet/block"
targetBlock={28124200}

/>

## Manual Upgrade

```js
cd $HOME
rm -rf shentu
git clone https://github.com/shentufoundation/shentu
cd shentu
git checkout v2.17.0
make install
sudo systemctl restart shentud && sudo journalctl -fu shentud -o cat
```
