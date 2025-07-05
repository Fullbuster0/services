---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeersGnoland from "@site/src/components/Peers/LivePeersGnoland";

<div className="h1-with-icon icon-gnoland">
# Gnolan Sync
</div>
<span className="sub-lines"> 
Chain ID: `test6` | Node Version: `latest`
</span>
<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

<SnapshotCard
  jsonUrl="https://snapshot.shazoes.xyz/testnets/metadata-gnoland.json"
/>

### Install dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop gnoland
```

### Reset Chain Data

```bash
rm -rf $HOME/gnoland-data/db
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot.shazoes.xyz/testnet/snapshot-gnoland.tar.lz4 && lz4 -c -d snapshot-gnoland.tar.lz4 | tar -x -C $HOME/gnoland-data && rm snapshot-gnoland.tar.lz4
```

### Restart Service

```bash
sudo systemctl restart gnoland && sudo journalctl -fu gnoland -o cat
```

</TabItem>

<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/gnoland-data/config/genesis.json https://files.shazoes.xyz/testnets/gnoland/genesis.json
```
</TabItem>
<TabItem value="livepeers" label="LivePeers">
<LivePeersGnoland
  rpc="https://gnoland-testnet-rpc.shazoes.xyz"
  homeFolder="gnoland-data"
  binaryName="gnoland"
  maxPeers={25}
/>
</TabItem>
</Tabs>
