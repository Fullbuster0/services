---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
import UpgradeRemainingBlock from '@site/src/components/Upgrade/UpgradeRemainingBlock';

<div className="h1-with-icon icon-axone">
# Axone Upgrade
</div>
<span className="sub-lines">Chain ID: `axone-1` | Node Version: `v1.0.0`</span>


## Manual Upgrade

```bash
cd $HOME
rm -rf axoned
git clone https://github.com/axone-protocol/axoned.git axoned
cd axoned
git checkout v1.0.0
make install
sudo systemctl restart axoned && sudo journalctl -fu axoned -o cat
```