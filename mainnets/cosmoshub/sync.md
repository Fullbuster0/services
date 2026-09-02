---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="h1-with-icon icon-cosmoshub">
# CosmosHub Sync
</div>
<span className="sub-lines"> 
Chain ID: `cosmoshub-4` | Node Version: `v28.0.0`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

:::info
**Soon** — Shazoes snapshot for CosmosHub is not available yet.
:::

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

:::info
**Soon** — Shazoes state sync for CosmosHub is not available yet.
:::

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.gaia/config/genesis.json https://files.shazoes.xyz/mainnets/cosmoshub/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.gaia/config/addrbook.json https://files.shazoes.xyz/mainnets/cosmoshub/addrbook.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeers
  rpc={[
    "https://cosmos-rpc.polkachu.com",
    "https://cosmoshub.rpc.kjnodes.com",
    "https://cosmoshub-mainnet-rpc.itrocket.net",
  ]}
  homeFolder=".gaia"
  binaryName="gaiad"
  maxPeers={25}
/>
</TabItem>
</Tabs>
