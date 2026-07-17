---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-shentu">
# Shentu Upgrade
</div>
<span className="sub-lines">Chain ID: `shentu-2.2` | Node Version: `v2.18.0`</span>

<br/><br/>
<span>Upgrade height: **29367500** (Proposal #54)</span>

> shentud v2.18.0 upgrade

## Manual Upgrade

```bash
cd $HOME
rm -rf shentu
git clone https://github.com/shentufoundation/shentu shentu
cd shentu
git checkout v2.18.0
make install
sudo systemctl restart shentud && sudo journalctl -fu shentud -o cat
```