import React, { useEffect, useState } from "react";

/**
 * Fetch the latest block height, trying multiple RPC endpoints in order.
 * Returns the height or null if all endpoints fail.
 */
async function fetchLatestBlockHeight(rpcs: string[]): Promise<number | null> {
  for (const rpc of rpcs) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${rpc}/block`, { signal: controller.signal });
      clearTimeout(tid);
      const data = await response.json();
      const height = parseInt(data?.result?.block?.header?.height, 10);
      if (!isNaN(height)) return height;
    } catch {
      continue; // try next RPC
    }
  }
  return null;
}

export default function UpgradeRemainingBlock({
  targetBlock = 1056500,
  rpc = "",
  rpcs = "",
  explorerUrl = "https://explorer.shazoes.xyz/hippo-mainnet/block",
}: {
  targetBlock?: number;
  rpc?: string;
  rpcs?: string;
  explorerUrl?: string;
}) {
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [error, setError] = useState(false);

  // Multi-RPC: prefer `rpcs` (comma-separated), fall back to `rpc` (single, backward compat)
  const rpcList = rpcs
    ? rpcs.split(",").map((s) => s.trim()).filter(Boolean)
    : rpc
      ? [rpc]
      : [];

  useEffect(() => {
    if (rpcList.length === 0) {
      setError(true);
      return;
    }

    const fetchHeight = async () => {
      const height = await fetchLatestBlockHeight(rpcList);
      if (height !== null) {
        setLatestBlock(height);
        setError(false);
      } else {
        setError(true);
      }
    };

    fetchHeight();
    const interval = setInterval(fetchHeight, 6000); // update every 6s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcs, rpc]);

  const remaining = latestBlock !== null ? targetBlock - latestBlock : null;
  const reached = remaining !== null ? remaining <= 0 : false;

  if (error) {
    return (
      <span>
        <i>RPC unavailable — unable to fetch block height</i>
      </span>
    );
  }

  return (
    <span>
      {remaining !== null ? (
        <strong>{remaining >= 0 ? remaining : 0} </strong>
      ) : (
        <i>Loading...</i>
      )}
      &nbsp;|&nbsp;
      <strong>
        <i>
          {remaining !== null
            ? reached
              ? "Block reached, please upgrade."
              : "Please don't upgrade before the specified height."
            : ""}
        </i>
      </strong>
    </span>
  );
}
