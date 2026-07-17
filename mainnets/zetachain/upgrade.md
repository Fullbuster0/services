---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-zetachain">
# Zetachain Upgrade
</div>
<div className="sub-lines">
Chain ID: `zetachain_7000-1` | Node Version: `v32.0.0`
</div>

<div className="sub-lines">
Upgrade height: **9384000** (Proposal #62)
</div>

> v32.0.0 Upgrade

## Manual Upgrade

```bash
cd $HOME
rm -rf zetacored
git clone https://github.com/zeta-chain/node.git zetacored
cd zetacored
git checkout v32.0.0
make install
sudo systemctl restart zetacored && sudo journalctl -fu zetacored -o cat
```