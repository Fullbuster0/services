---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

<div className="h1-with-icon icon-babylon">
# Babylon Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `bbn-1` | Node Version: `v2.2.0`
</span>

<span> 
Upgrade at height: <a href="https://explorer.shazoes.xyz/babylon-mainnet/block/696120">696120</a><i>Please don`t upgrade before the specified height.</i>
</span>

## Manual Upgrade

```js
cd $HOME
rm -rf babylon
git clone https://github.com/babylonlabs-io/babylon.git
cd babylon
git checkout v2.2.0
BABYLON_BUILD_OPTIONS="mainnet" make install
sudo systemctl restart babylond && sudo journalctl -fu babylond -o cat
```
