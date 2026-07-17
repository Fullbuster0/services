---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-atomone-testnet">
# AtomOne Testnet Upgrade
</div>
<span className="sub-lines">Chain ID: `atomone-testnet-1` | Node Version: `v4`</span>

<br/><br/>
<span>Upgrade height: **7065000** (Proposal #12)</span>

> v4

## Manual Upgrade

```bash
cd $HOME
rm -rf atomone
git clone https://github.com/atomone-hub/atomone.git atomone
cd atomone
git checkout v4
make install
sudo systemctl restart atomoned && sudo journalctl -fu atomoned -o cat
```