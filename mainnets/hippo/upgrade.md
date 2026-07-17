---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-hippo">
# Hippo Protocol Upgrade
</div>
<div className="sub-lines">
Chain ID: `hippo-1` | Node Version: `v1.0.2`
</div>

<div className="sub-lines">
Upgrade height: **3847000** (Proposal #24)
</div>

> Software upgrade to v1.0.2(Security Update)

## Manual Upgrade

```bash
cd $HOME
rm -rf hippo
git clone https://github.com/hippo-protocol/hippo.git hippo
cd hippo
git checkout v1.0.2
make install
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```