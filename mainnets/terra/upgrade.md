---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
import UpgradeRemainingBlock from '@site/src/components/Upgrade/UpgradeRemainingBlock';

<div className="h1-with-icon icon-terra">
# Terra Upgrade
</div>
<span className="sub-lines">Chain ID: `phoenix-1` | Node Version: `v2.20.0`</span>

<br/><br/>
<span>Upgrade height: **22055000** (Proposal #4849) | Remaining Block : <UpgradeRemainingBlock targetBlock={22055000} rpc="https://terra-mainnet-rpc.shazoes.xyz" explorerUrl="https://explorer.shazoes.xyz/terra-mainnet/block" /></span>

> v2.20

## Manual Upgrade

```bash
cd $HOME
rm -rf terra
git clone https://github.com/phoenix-directive/core terra
cd terra
git checkout v2.20.0
make install
sudo systemctl restart terrad && sudo journalctl -fu terrad -o cat
```