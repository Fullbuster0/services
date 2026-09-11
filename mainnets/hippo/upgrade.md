---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
import UpgradeRemainingBlock from '@site/src/components/Upgrade/UpgradeRemainingBlock';

<div className="h1-with-icon icon-hippo">
# Hippo Protocol Upgrade
</div>
<span className="sub-lines">Chain ID: `hippo-1` | Node Version: `v1.0.2`</span>

<br/><br/>
<span>Upgrade height: **7165000** (Proposal #30) | Remaining Block : <UpgradeRemainingBlock targetBlock={7165000} rpc="https://hippo-mainnet-rpc.shazoes.xyz" rpcs="https://hippo-mainnet-rpc.shazoes.xyz,https://hippo-mainnet-rpc.itrocket.net,https://hippo-rpc.polkachu.com" explorerUrl="https://explorer.shazoes.xyz/hippo-mainnet/block" /></span>

## Manual Upgrade

```bash
cd $HOME
rm -rf hippo
git clone https://github.com/hippo-protocol/hippo.git hippo
cd hippo
git checkout v2.0.0
make install
sudo systemctl restart hippod && sudo journalctl -fu hippod -o cat
```