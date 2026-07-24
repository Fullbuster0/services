---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
import UpgradeRemainingBlock from '@site/src/components/Upgrade/UpgradeRemainingBlock';

<div className="h1-with-icon icon-terra">
# Terra Upgrade
</div>
<span className="sub-lines">Chain ID: `phoenix-1` | Node Version: `v2.4.0`</span>


## Manual Upgrade

```bash
cd $HOME
rm -rf terra
git clone https://github.com/phoenix-directive/core terra
cd terra
git checkout v2.4.0
make install
sudo systemctl restart terrad && sudo journalctl -fu terrad -o cat
```