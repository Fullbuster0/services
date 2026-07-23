---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
import UpgradeRemainingBlock from '@site/src/components/Upgrade/UpgradeRemainingBlock';

<div className="h1-with-icon icon-zetachain">
# Zetachain Upgrade
</div>
<span className="sub-lines">Chain ID: `zetachain_7000-1` | Node Version: `v18`</span>


## Manual Upgrade

```bash
cd $HOME
rm -rf zetacored
git clone https://github.com/zeta-chain/node.git zetacored
cd zetacored
git checkout v18
make install
sudo systemctl restart zetacored && sudo journalctl -fu zetacored -o cat
```