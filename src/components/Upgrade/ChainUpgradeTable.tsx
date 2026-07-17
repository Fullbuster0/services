import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import mainnetUpgrades from "@site/static/data/mainnetupgrade.json";
import testnetUpgrades from "@site/static/data/testnetupgrade.json";
import Link from "@docusaurus/Link";

/**
 * Compute the average block time (in seconds) for a chain by sampling
 * recent blocks. We fetch the latest block height, then sample a few
 * blocks at different offsets and average the timestamp deltas.
 *
 * Falls back to a sensible default if the RPC doesn't expose
 * /block?height=N (some LCD-only endpoints don't).
 */
async function getAverageBlockTime(rpc: string, latestHeight: number): Promise<number> {
  // Step size proportional to chain block time — sample every ~120s
  // worth of blocks (≈20 blocks for a 6s chain) for a stable average.
  const sampleOffsets = [1, 5, 20, 50, 100];
  try {
    const samples = await Promise.all(
      sampleOffsets.map(async (offset) => {
        const h = latestHeight - offset;
        if (h <= 0) return null;
        try {
          const res = await fetch(`${rpc}/block?height=${h}`);
          const json = await res.json();
          const timeStr = json?.result?.block?.header?.time;
          if (!timeStr) return null;
          return new Date(timeStr).getTime();
        } catch {
          return null;
        }
      })
    );
    const pairs: number[] = [];
    for (let i = 1; i < samples.length; i++) {
      const prev = samples[i - 1];
      const curr = samples[i];
      if (prev != null && curr != null) {
        const diff = Math.abs(curr - prev);
        if (diff > 0 && diff < 60 * 60 * 1000) {
          // Sanity bound: < 1 hour per block diff
          pairs.push(diff);
        }
      }
    }
    if (pairs.length === 0) return 6.5;
    // Average per-block time = total time / number of blocks between samples
    const totalDelta = pairs.reduce((a, b) => a + b, 0);
    const totalBlocks = sampleOffsets.slice(1).reduce((a, b) => a + b, 0); // 5+20+50+100
    return totalDelta / 1000 / totalBlocks;
  } catch {
    return 6.5;
  }
}

export default function ChainUpgradeTable({ chainType = "mainnet" }) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const upgrades = chainType === "testnet" ? testnetUpgrades : mainnetUpgrades;

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch from runtime JSON instead of build-time import
        const response = await fetch("/data/mainnetupgrade.json");
        const mainnetUpgrades = await response.json();
        const responseTestnet = await fetch("/data/testnetupgrade.json");
        const testnetUpgrades = await responseTestnet.json();

        const upgrades =
          chainType === "testnet" ? testnetUpgrades : mainnetUpgrades;

        if (!upgrades || upgrades.length === 0) {
          setData([]);
          setLoaded(true);
          return;
        }

        const results = await Promise.all(
          upgrades.map(async (chain: any) => {
            try {
              const res = await fetch(`${chain.rpc}/status`);
              const json = await res.json();
              const latestHeight = parseInt(
                json.result.sync_info.latest_block_height
              );
              const latestTime = new Date(
                json.result.sync_info.latest_block_time
              );

              // Hide items whose upgrade height has already been reached.
              if (latestHeight >= chain.target_height) {
                return null;
              }

              // Real-time block time calculation from recent samples
              const avgBlockTime = await getAverageBlockTime(
                chain.rpc,
                latestHeight
              );

              const remainingBlocks = chain.target_height - latestHeight;
              const secondsLeft = remainingBlocks * avgBlockTime;
              const eta = new Date(latestTime.getTime() + secondsLeft * 1000);

              const now = new Date();
              const diff = eta.getTime() - now.getTime();
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);

              return {
                ...chain,
                latestHeight,
                avgBlockTime,
                eta: eta.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
                timeLeft: `${days}d ${hours}h ${minutes}m`,
              };
            } catch (e) {
              // Keep entries with RPC errors visible so the operator can debug.
              return {
                ...chain,
                latestHeight: "Error",
                eta: "Error",
                timeLeft: "Error",
                avgBlockTime: "Error",
              };
            }
          })
        );

        const filtered = results.filter((item: any) => item !== null);
        setData(filtered);
        setLoaded(true);
      } catch (e) {
        console.error("fetchData error", e);
        setLoaded(true);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [chainType]);

  // Render nothing until first load completes.
  if (!loaded) return null;

  // Render nothing when there are no upcoming upgrades — no fallback text.
  if (data.length === 0) return null;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full table-auto text-sm text-left border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">Network</th>
            <th className="px-4 py-2 border-b">Proposal ID</th>
            <th className="px-4 py-2 border-b">Block</th>
            <th className="px-4 py-2 border-b">Avg Block Time</th>
            <th className="px-4 py-2 border-b">Estimate Upgrade</th>
            <th className="px-4 py-2 border-b">Your Local Time</th>
            <th className="px-4 py-2 border-b">Version</th>
            <th className="px-4 py-2 border-b">Guide</th>
          </tr>
        </thead>
        <tbody className="text-gray-900 dark:text-gray-100">
          {data.map((chain, idx) => (
            <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-4 py-2">{idx + 1}</td>
              <td className="px-4 py-2">
                <Link href={chain.link}>
                  {DOMPurify.sanitize(chain.network, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link href={chain.proposal}>#{DOMPurify.sanitize(chain.proposal_id, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}</Link>
              </td>
              <td className="px-4 py-2">{chain.target_height}</td>
              <td className="px-4 py-2">
                {typeof chain.avgBlockTime === "number"
                  ? `${chain.avgBlockTime.toFixed(1)}s`
                  : DOMPurify.sanitize(String(chain.avgBlockTime), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}
              </td>
              <td className="px-4 py-2">
                {DOMPurify.sanitize(chain.timeLeft, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}
              </td>
              <td className="px-4 py-2">
                {DOMPurify.sanitize(chain.eta, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}
              </td>
              <td className="px-4 py-2">
                {DOMPurify.sanitize(chain.version, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}
              </td>
              <td className="px-4 py-2">
                <Link href={`${chain.link}upgrade`}>Guide</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
