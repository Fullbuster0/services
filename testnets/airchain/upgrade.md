---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

import UpgradeRemainingBlock from "@site/src/components/Upgrade/UpgradeRemainingBlock";

<div className="h1-with-icon icon-airchain">
# Airchain Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `varanasi-1` | Node Version: `v0.3.2`
</span>

#### Version : v0.3.2

<span> 
<i>Upgrade at Height -> </i><a href="https://explorer.shazoes.xyz/airchain-testnet/block/451850">451850</a>
</span>

## Manual Upgrade

### Download and Build Binaries

```bash
cd $HOME
wget -O junctiond https://github.com/airchains-network/junction/releases/download/v0.3.2/junctiond-linux-amd64
chmod +x junctiond
sudo mv $HOME/junctiond $(which junctiond)
```

### Restart Service

```bash
sudo systemctl restart junctiond && sudo journalctl -fu junctiond -o cat
```
