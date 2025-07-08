---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `hippo-protocol-1` | Node Version: `v1.0.0`
</span>

<span> 
Upgrade at height: <a href="https://explorer.shazoes.xyz/hippo-mainnet/block/1056500">1056500</a><i>Please don`t upgrade before the specified height.</i>
</span>

## Manual Upgrade

```js
cd $HOME
rm -rf hippo-protocol
git clone https://github.com/hippocrat-dao/hippo-protocol
cd hippo-protocol
git checkout v1.0.1
make install
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```
