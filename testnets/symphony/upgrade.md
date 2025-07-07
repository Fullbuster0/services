---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---

<div className="h1-with-icon icon-symphony">
# Symphony Upgrade
</div>
<span className="sub-lines"> 
Chain ID: `symphony-testnet-4` | Node Version: `v5testnet`
</span>

#### Version : v5testnet

<span> 
<i>Upgrade at Height -> </i><a href="https://explorer.shazoes.xyz/symphony-testnet/block/11366277">11366277</a>
</span>

## Manual Upgrade

### Download and Build Binaries

```bash
cd $HOME
rm -rf symphony
git clone https://github.com/Orchestra-Labs/symphony.git
cd symphony
git checkout fix/change-upgrade-name-to-fix-testnet-migration
make install
```

### Restart Service

```bash
sudo systemctl restart symphonyd && sudo journalctl -fu symphonyd -o cat
```
