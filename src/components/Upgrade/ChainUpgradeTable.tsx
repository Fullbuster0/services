import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Link from "@docusaurus/Link";

/**
 * Fetch a Tendermint RPC path, trying multiple endpoints in order.
 * Returns parsed JSON or throws if all endpoints fail.
 */
async function fetchWithFallback(rpcs: string[], path: string): Promise<any> {
  for (const rpc of rpcs) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${rpc}${path}`, { signal: controller.signal });
      clearTimeout(tid);
      const json = await res.json();
      if (json?.result) return json;
    } catch {
      continue; // try next RPC
    }
  }
  throw new Error(`All ${rpcs.length} RPC endpoint(s) failed for ${path}`);
}

/**
 * Compute the average block time (in seconds) for a chain by sampling
 * recent blocks. Falls back to 6.5s if the RPC doesn't expose
 * /block?height=N (some LCD-only endpoints don't).
 */
async function getAverageBlockTime(
  rpcs: string[],
  latestHeight: number
): Promise<number> {
  const sampleOffsets = [1, 5, 20, 50, 100];
  try {
    const samples = await Promise.all(
      sampleOffsets.map(async (offset) => {
        const h = latestHeight - offset;
        if (h <= 0) return null;
        try {
          const json = await fetchWithFallback(rpcs, `/block?height=${h}`);
          const timeStr = json?.result?.block?.header?.time;
          if (!timeStr) return null;
          return { height: h, time: new Date(timeStr).getTime() };
        } catch {
          return null;
        }
      })
    );
    const valid = samples.filter(
      (s): s is { height: number; time: number } => s !== null
    );
    if (valid.length < 2) return 6.5;

    // Sort by block height ASC so delta = newer - older is positive.
    valid.sort((a, b) => a.height - b.height);

    let totalDeltaMs = 0;
    let totalBlocks = 0;
    for (let i = 1; i < valid.length; i++) {
      const dt = valid[i].time - valid[i - 1].time;
      const dh = valid[i].height - valid[i - 1].height;
      if (dt > 0 && dh > 0 && dt < 60 * 60 * 1000) {
        totalDeltaMs += dt;
        totalBlocks += dh;
      }
    }
    if (totalBlocks === 0) return 6.5;
    return totalDeltaMs / 1000 / totalBlocks;
  } catch {
    return 6.5;
  }
}

export default function ChainUpgradeTable({
  chainType = "mainnet",
}: {
  chainType?: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch from runtime JSON (not build-time import) so data is always fresh
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
            // Multi-RPC: prefer rpc_endpoints array, fall back to single rpc
            const rpcs: string[] =
              chain.rpc_endpoints?.length > 0
                ? chain.rpc_endpoints
                : chain.rpc
                  ? [chain.rpc]
                  : [];

            if (rpcs.length === 0) {
              return {
                ...chain,
                latestHeight: "Error",
                eta: "Error",
                timeLeft: "Error",
                avgBlockTime: "Error",
              };
            }

            try {
              const json = await fetchWithFallback(rpcs, "/status");
              const latestHeight = parseInt(
                json.result.sync_info.latest_block_height,
                10
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
                rpcs,
                latestHeight
              );

              const remainingBlocks = chain.target_height - latestHeight;
              const secondsLeft = remainingBlocks * avgBlockTime;
              const eta = new Date(
                latestTime.getTime() + secondsLeft * 1000
              );

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
            <tr
              key={idx}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2">{idx + 1}</td>
              <td className="px-4 py-2">
                <Link href={chain.link}>
                  {DOMPurify.sanitize(chain.network, {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: [],
                  })}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link href={chain.proposal}>
                  #
                  {DOMPurify.sanitize(chain.proposal_id, {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: [],
                  })}
                </Link>
              </td>
              <td className="px-4 py-2">{chain.target_height}</td>
              <td className="px-4 py-2">
                {typeof chain.avgBlockTime === "number"
                  ? `${chain.avgBlockTime.toFixed(1)}s`
                  : DOMPurify.sanitize(String(chain.avgBlockTime), {
                      ALLOWED_TAGS: [],
                      ALLOWED_ATTR: [],
                    })}
              </td>
              <td className="px-4 py-2">
                {DOMPurify.sanitize(chain.timeLeft, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
                })}
              </td>
              <td className="px-4 py-2">
                {DOMPurify.sanitize(chain.eta, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
                })}
              </td>
              <td className="px-4 py-2">
                {DOMPurify.sanitize(chain.version, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
                })}
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
