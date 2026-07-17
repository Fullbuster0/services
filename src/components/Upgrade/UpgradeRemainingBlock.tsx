import Link from "@docusaurus/Link";
import React, { useEffect, useState } from "react";

export default function UpgradeRemainingBlock({ targetBlock = 1056500, rpc = "https://rpc.hippo.shazoes.xyz", explorerUrl = "https://explorer.shazoes.xyz/hippo-mainnet/block" }) {
  const [latestBlock, setLatestBlock] = useState(null);

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        const response = await fetch(`${rpc}/block`);
        const data = await response.json();
        const blockHeight = parseInt(data.result.block.header.height);
        setLatestBlock(blockHeight);
      } catch (error) {
        console.error("Failed to fetch latest block:", error);
      }
    };

    fetchLatestBlock();
    const interval = setInterval(fetchLatestBlock, 6000); // update setiap 6 detik
    return () => clearInterval(interval);
  }, [rpc]);

  const remaining = latestBlock !== null ? targetBlock - latestBlock : null;
  const reached = remaining !== null ? remaining <= 0 : false;

  return (
    <span>
      {remaining !== null ? <strong>{remaining >= 0 ? remaining : 0} </strong> : <i>Loading...</i>}
      &nbsp;|&nbsp;
      <strong>
        <i>{remaining !== null ? (reached ? "Block reached, please upgrade." : "Please don't upgrade before the specified height.") : ""}</i>
      </strong>
    </span>
  );
}
