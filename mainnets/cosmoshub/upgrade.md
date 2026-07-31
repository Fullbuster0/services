---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

<div className="h1-with-icon icon-cosmoshub">
# CosmosHub Upgrade
</div>
<span className="sub-lines">Chain ID: `cosmoshub-4` | Node Version: `v25.1.0`</span>


## Manual Upgrade

```bash
cd $HOME
rm -rf gaia
git clone https://github.com/cosmos/gaia.git
cd gaia
git checkout v25.1.0
make install
sudo systemctl restart gaiad && sudo journalctl -fu gaiad -o cat
```
