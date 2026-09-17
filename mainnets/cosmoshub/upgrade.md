---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
import UpgradeRemainingBlock from '@site/src/components/Upgrade/UpgradeRemainingBlock';

<div className="h1-with-icon icon-cosmoshub">
# CosmosHub Upgrade
</div>
<span className="sub-lines">Chain ID: `cosmoshub-4` | Node Version: `v28.0.0`</span>

<br/><br/>
<span>Upgrade height: **33073000** (Proposal #1055) | Remaining Block : <UpgradeRemainingBlock targetBlock={33073000} rpc="https://cosmos-rpc.polkachu.com" rpcs="https://cosmos-rpc.polkachu.com,https://rpc-cosmoshub.keplr.app,https://rpc.cosmos.directory/cosmoshub" explorerUrl="https://explorer.shazoes.xyz/cosmoshub-mainnet/block" /></span>

## Manual Upgrade

```bash
cd $HOME
rm -rf gaia
git clone https://github.com/cosmos/gaia.git gaia
cd gaia
git checkout v28.2.0
make install
sudo systemctl restart gaiad && sudo journalctl -fu gaiad -o cat
```