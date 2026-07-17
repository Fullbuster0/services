---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-axone">
# Axone Upgrade
</div>
<div className="sub-lines">
Chain ID: `axone-1` | Node Version: `v1.0.0`
</div>


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