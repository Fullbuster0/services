---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `hippo-protocol-testnet-1` | Node Version: `v2.0.0`
</span>

<UpgradeRemainingBlock
rpc="https://hippo-mainnet-rpc.shazoes.xyz"
explorerUrl="https://explorer.shazoes.xyz/hippo-testnet/block"
targetBlock={5328000}

/>

## Manual Upgrade

```js
cd $HOME
rm -rf hippo-protocol
git clone https://github.com/hippo-protocol/hippo-protocol
cd hippo-protocol
git checkout v2.0.0
make install
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```
