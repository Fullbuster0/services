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
Chain ID: `atomone-testnet-1` | Node Version: `v3.0.3`
</span>

<UpgradeRemainingBlock
rpc="https://atomone-testnet-rpc.shazoes.xyz"
explorerUrl="https://explorer.shazoes.xyz/atomone-testnet/block"
targetBlock={3240000}

/>

## Manual Upgrade

```bash
cd $HOME
rm -rf atomone
git clone https://github.com/atomone-hub/atomone.git
cd atomone
git checkout v3.0.1
make install
sudo systemctl restart atomoned && sudo journalctl -fu atomoned -o cat
```
