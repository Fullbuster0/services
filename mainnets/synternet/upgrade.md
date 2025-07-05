---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

<div className="h1-with-icon icon-synternet">
# Synternet Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `synternet-1` | Node Version: `v0.25`
</span>

<span> 
Upgrade at height: <a href="https://explorer.shazoes.xyz/synternet-mainnet/block/5814566">5814566</a><i>Please don`t upgrade before the specified height.</i>
</span>

## Manual Upgrade

```js
cd $HOME
wget https://github.com/Synternet/synternet-chain-releases/releases/download/v0.25/syntd-linux-amd64-v0.25 -O syntd
chmod +x syntd
sudo mv syntd $HOME/go/bin/
sudo systemctl restart syntd && sudo journalctl -fu syntd -o cat
```
