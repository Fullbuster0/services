---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-atomone">
# Atomone Upgrade
</div>
<span className="sub-lines">Chain ID: `atomone-1` | Node Version: `v4.0.0`</span>

<span>Upgrade height: **9550000** (Proposal #21)</span>

> AtomOne v4 Upgrade

## Manual Upgrade

```bash
cd $HOME
rm -rf atomone
git clone https://github.com/atomone-hub/atomone.git atomone
cd atomone
git checkout v4.0.0
make install
sudo systemctl restart atomoned && sudo journalctl -fu atomoned -o cat
```