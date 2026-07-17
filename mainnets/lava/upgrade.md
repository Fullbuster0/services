---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
<div className="h1-with-icon icon-lava">
# Lava Network Upgrade
</div>
<span className="sub-lines">Chain ID: `lava-1` | Node Version: `v5.5.1`</span>

<br/><br/>
<span>Upgrade height: **4154305** (Proposal #59)</span>

> Lava Mainnet Upgrade to v5.5.1

## Manual Upgrade

```bash
cd $HOME
rm -rf lava
git clone https://github.com/lavanet/lava.git lava
cd lava
git checkout v5.5.1
make install
sudo systemctl restart lavad && sudo journalctl -fu lavad -o cat
```