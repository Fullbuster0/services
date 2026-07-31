---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SnapshotCard from "@site/src/components/Snapshot/SnapshotCard";
import LivePeers from "@site/src/components/Peers/LivePeers";

<div className="archived-notice-banner">
  <span className="badge-archive">ARCHIVE</span>
  <span className="notice-text">Network no longer actively validated · Services docs only (no updated)</span>
</div>

<div className="h1-with-icon icon-mantra">
# Mantra Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `mantra-1` | Node Version: `v6.1.4`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export MANTRA_CHAIN_ID="mantra-1"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
mantrachaind keys add wallet
```

### Recovery Wallet

```bash
mantrachaind keys add wallet --recover
```

### List All Wallet

```bash
mantrachaind keys list
```

### Delete Wallet

```bash
mantrachaind keys delete wallet
```

### Check Wallet Balance

```bash
mantrachaind q bank balances $(mantrachaind keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Check Pubkey

```bash
mantrachaind comet show-validator
```

### Make File validator.json

```bash
tee $HOME/.mantrachain/validator.json > /dev/null << EOF
{
    "pubkey": YOUR_PUBKEY,
    "amount": "1000000000uom",
    "moniker": "MONIKER",
    "identity": "YOUR_KEYBASE_ID",
    "website": "YOUR_WEBSITE_URL",
    "security": "YOUR_CONTACT_MAIL",
    "details": "YOUR_DETAILS.",
    "commission-rate": "0.1",
    "commission-max-rate": "0.2",
    "commission-max-change-rate": "0.01",
    "min-self-delegation": "1"
}
EOF
```

### Create Validator

```bash
mantrachaind tx staking create-validator $HOME/.mantrachain/validator.json --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas 225000 --gas-prices 0.01uom
```

### Edit Validator

```bash
mantrachaind tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$MANTRA_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=0.01uom
```

### Check Jailed Reason

```bash
mantrachaind query slashing signing-info $(mantrachaind tendermint show-validator)
```

### Unjail Validator

```bash
mantrachaind tx slashing unjail --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
mantrachaind tx distribution withdraw-all-rewards --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

### Withdraw Rewards with Comission

```bash
mantrachaind tx distribution withdraw-rewards $(mantrachaind keys show wallet --bech val -a) --commission --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

### Delegate Tokens to Your Validator

```bash
mantrachaind tx staking delegate $(mantrachaind keys show wallet --bech val -a) 1000000uom --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

### Redelegate Tokens to Another Validator

```bash
mantrachaind tx staking redelegate $(mantrachaind keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 1000000uom --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

### Unbond Tokens from Your Validator

```bash
mantrachaind tx staking unbond $(mantrachaind keys show wallet --bech val -a) 1000000uom --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

### Send Tokens to Any Wallet

```bash
mantrachaind tx bank send wallet <TO_WALLET_ADDRESS> 1000000uom --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

</TabItem>
<TabItem value="service" label="Service">

## Service

### Reload Service

```bash
sudo systemctl daemon-reload
```

### Enable Service

```bash
sudo systemctl enable mantrachaind
```

### Disable Service

```bash
sudo systemctl disable mantrachaind
```

### Start Service

```bash
sudo systemctl start mantrachaind
```

### Stop Service

```bash
sudo systemctl stop mantrachaind
```

### Restart Service

```bash
sudo systemctl restart mantrachaind
```

### Check Service Status

```bash
sudo systemctl status mantrachaind
```

### Check Service Logs

```bash
sudo journalctl -u mantrachaind -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
mantrachaind tx gov vote 1 yes --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

### List all Proposals

```bash
mantrachaind query gov proposals
```

### Check Vote

```bash
mantrachaind tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $MANTRA_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 0.01uom -y
```

### Create new Proposal

```bash
mantrachaind tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uom \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=0.01uom \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.mantrachain/config/config.toml
```

### Get Validator Info

```bash
mantrachaind status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
mantrachaind q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
mantrachaind status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
mantrachaind status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(mantrachaind tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.mantrachain/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.01uom\"/" $HOME/.mantrachain/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.mantrachain/config/config.toml
```

### Reset Chain Data

```bash
mantrachaind tendermint unsafe-reset-all --home $HOME/.mantrachain --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

<div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
  WARNING!!! Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!
</div>

### Delete Node

```bash
sudo systemctl stop mantrachaind && sudo systemctl disable mantrachaind && sudo rm /etc/systemd/system/mantrachaind.service && sudo systemctl daemon-reload && sudo rm -rf $(which mantrachaind) && rm -rf $HOME/.mantrachain
```

</TabItem>

</Tabs>
