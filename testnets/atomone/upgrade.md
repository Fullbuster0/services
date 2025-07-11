---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-atomone">
# Atomone Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `atomone-testnet-1` | Node Version: `v2.0.0-rc2`
</span>

#### Version : v2.0.0-rc2

<span> 
<i>Upgrade at Height -> </i><a href="https://explorer.shazoes.xyz/atomone-testnet/block/1240000">1240000</a>
</span>

## Manual Upgrade

### Download and Build Binaries

```bash
cd $HOME
wget -O atomoned https://github.com/atomone-hub/atomone/releases/download/v2.0.0-rc2/atomoned-v2.0.0-rc2-linux-amd64
chmod +x atomoned
mv atomoned $HOME/go/bin
```

### Restart Service

```bash
sudo systemctl restart atomoned && sudo journalctl -fu atomoned -o cat
```
