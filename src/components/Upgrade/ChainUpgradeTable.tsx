import React, { useEffect, useState } from "react";
import mainnetUpgrades from "@site/static/data/mainnetupgrade.json";
import testnetUpgrades from "@site/static/data/testnetupgrade.json";
import Link from "@docusaurus/Link";

export default function ChainUpgradeTable({ chainType = "mainnet" }) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const upgrades = chainType === "testnet" ? testnetUpgrades : mainnetUpgrades;

  useEffect(() => {
    async function fetchData() {
      // If JSON has no entries, render nothing.
      if (!upgrades || upgrades.length === 0) {
        setData([]);
        setLoaded(true);
        return;
      }

      const results = await Promise.all(
        upgrades.map(async (chain) => {
          try {
            const res = await fetch(`${chain.rpc}/status`);
            const json = await res.json();
            const latestHeight = parseInt(json.result.sync_info.latest_block_height);
            const latestTime = new Date(json.result.sync_info.latest_block_time);

            // Hide items whose upgrade height has already been reached.
            if (latestHeight >= chain.target_height) {
              return null;
            }

            const remainingBlocks = chain.target_height - latestHeight;
            const averageBlockTime = 6.5; // seconds per block
            const secondsLeft = remainingBlocks * averageBlockTime;
            const eta = new Date(latestTime.getTime() + secondsLeft * 1000);

            const now = new Date();
            const diff = eta.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            return {
              ...chain,
              latestHeight,
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
            };
          }
        })
      );

      const filtered = results.filter(
        (item) => item !== null && item.latestHeight !== "Error"
      );
      setData(filtered);
      setLoaded(true);
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
            <th className="px-4 py-2 border-b">Proposal</th>
            <th className="px-4 py-2 border-b">Block</th>
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
                <Link href={chain.link}>{chain.network}</Link>
              </td>
              <td className="px-4 py-2">
                <Link href={chain.proposal}>Proposal</Link>
              </td>
              <td className="px-4 py-2">{chain.target_height}</td>
              <td className="px-4 py-2">{chain.timeLeft}</td>
              <td className="px-4 py-2">{chain.eta}</td>
              <td className="px-4 py-2">{chain.version}</td>
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
