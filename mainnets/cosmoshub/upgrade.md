---
hide_table_of_contents: false
title: Upgrade
sidebar_position: 4
---
import UpgradeRemainingBlock from '@site/src/components/Upgrade/UpgradeRemainingBlock';

<div className="h1-with-icon icon-cosmoshub">
# CosmosHub Upgrade
</div>
<span className="sub-lines">Chain ID: `cosmoshub-4` | Node Version: `v25.1.0`</span>

<br/><br/>
<span>Upgrade height: **32361600** (Proposal #1049) | Remaining Block : <UpgradeRemainingBlock targetBlock={32361600} rpc="https://rpc-cosmoshub.keplr.app" rpcs="https://cosmos-rpc.polkachu.com,https://rpc-cosmoshub.keplr.app,https://rpc.cosmos.directory/cosmoshub" explorerUrl="https://explorer.shazoes.xyz/CosmosHub-mainnet/block" /></span>

## Manual Upgrade

```bash
cd $HOME
rm -rf gaia
git clone https://github.com/cosmos/gaia.git gaia
cd gaia
git checkout v27.6.0
make install
sudo systemctl restart gaiad && sudo journalctl -fu gaiad -o cat
```