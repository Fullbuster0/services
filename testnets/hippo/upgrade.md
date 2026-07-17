---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-hippo-testnet">
# Hippo Protocol Testnet Upgrade
</div>
<span className="sub-lines">Chain ID: `hippo-testnet-1` | Node Version: `v1.0.1`</span>


## Manual Upgrade

```bash
cd $HOME
rm -rf hippo
git clone https://github.com/hippo-protocol/hippo.git hippo
cd hippo
git checkout v1.0.1
make install
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```