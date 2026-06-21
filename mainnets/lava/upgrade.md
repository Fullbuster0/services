---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-lava">
# Lava Network Upgrade
</div>
<span className="sub-lines">Chain ID: `lava-1` | Node Version: `v1.0.0`</span>




## Manual Upgrade

```bash
cd $HOME
rm -rf lava
git clone https://github.com/lavanet/lava.git lava
cd lava
git checkout v1.0.0
make install
sudo systemctl restart lavad && sudo journalctl -fu lavad -o cat
```