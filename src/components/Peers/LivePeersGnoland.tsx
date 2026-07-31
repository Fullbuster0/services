import React, { useEffect, useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import { expandRpcFallbacks } from "./rpcFallbackMap";

interface LivePeersProps {
  rpc: string | string[];
  rpcs?: string[];
  homeFolder?: string;
  binaryName?: string;
  maxPeers?: number;
}

type Status = "loading" | "ok" | "error";

function normalizeRpcList(
  rpc: string | string[] | undefined,
  extra?: string[],
): string[] {
  const primary = Array.isArray(rpc) ? rpc : rpc ? [rpc] : [];
  const first = primary[0] || "";
  const rest = [...primary.slice(1), ...(extra || [])];
  if (!first && rest.length === 0) return [];
  return expandRpcFallbacks(first || rest[0], [
    ...(first ? rest : rest.slice(1)),
  ]);
}

async function fetchNetInfo(rpcBase: string, timeoutMs = 8000): Promise<any> {
  const base = rpcBase.replace(/\/+$/, "");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const response = await fetch(`${base}/net_info`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function peersFromNetInfo(data: any): string[] {
  const raw = data?.result?.peers || data?.peers || [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((peer: any) => peer?.node_info?.net_address)
    .filter((x: unknown): x is string => typeof x === "string" && x.length > 0);
}

function shuffleArray(array: string[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function LivePeersGnoland({
  rpc,
  rpcs,
  homeFolder = "homeFolder",
  binaryName = "binaryName",
  maxPeers = 25,
}: LivePeersProps) {
  const [peersOnly, setPeersOnly] = useState("");
  const [scriptOutput, setScriptOutput] = useState("");
  const [peerCount, setPeerCount] = useState(0);
  const [usedPeerCount, setUsedPeerCount] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [triedCount, setTriedCount] = useState(0);
  const [lastError, setLastError] = useState("");

  useEffect(() => {
    const endpoints = normalizeRpcList(rpc, rpcs);
    if (endpoints.length === 0) {
      setStatus("error");
      setLastError("No RPC endpoint configured.");
      return;
    }

    let cancelled = false;

    async function fetchPeers() {
      setStatus("loading");
      setLastError("");
      setTriedCount(0);
      const errors: string[] = [];

      for (let i = 0; i < endpoints.length; i++) {
        if (cancelled) return;
        const endpoint = endpoints[i];
        setTriedCount(i + 1);
        try {
          const data = await fetchNetInfo(endpoint);
          const allPeers = peersFromNetInfo(data);
          if (allPeers.length === 0) {
            errors.push(`${endpoint}: empty peer list`);
            if (i < endpoints.length - 1) continue;
          }
          if (cancelled) return;

          const shuffledPeers = shuffleArray(allPeers).slice(0, maxPeers);
          const peersString = shuffledPeers.join(",");

          setPeerCount(allPeers.length);
          setUsedPeerCount(shuffledPeers.length);
          setPeersOnly(peersString);
          setScriptOutput(
            `cd $HOME
gnoland config set p2p.persistent_peers ${peersString}

sudo systemctl restart ${binaryName} && sudo journalctl -u ${binaryName} -f --no-hostname -o cat`,
          );
          setStatus("ok");
          return;
        } catch (err: any) {
          const msg =
            err?.name === "AbortError"
              ? "timeout"
              : err?.message || String(err);
          errors.push(`${endpoint}: ${msg}`);
          console.warn(
            `[LivePeersGnoland] RPC failed (${i + 1}/${endpoints.length}):`,
            endpoint,
            msg,
          );
        }
      }

      if (cancelled) return;
      setStatus("error");
      setLastError(errors.slice(-3).join(" · ") || "all RPCs failed");
    }

    fetchPeers();
    return () => {
      cancelled = true;
    };
  }, [rpc, rpcs, homeFolder, binaryName, maxPeers]);

  if (status === "error") {
    return (
      <>
        <p>
          <strong>Failed to fetch peer data</strong> after trying{" "}
          {triedCount || "all"} RPC endpoint{triedCount === 1 ? "" : "s"}.
        </p>
        <CodeBlock language="bash">
          {`All configured RPCs failed (down, CORS, or network).
${lastError ? `Last errors: ${lastError}` : ""}`}
        </CodeBlock>
      </>
    );
  }

  return (
    <>
      <p>
        Number of active Peers: <strong>{usedPeerCount}</strong>
        {peerCount > usedPeerCount ? <> (of {peerCount} total)</> : null}
      </p>
      <CodeBlock language="bash">{peersOnly || "Loading peers…"}</CodeBlock>
      <CodeBlock language="bash">
        {scriptOutput || "Loading config script…"}
      </CodeBlock>
    </>
  );
}
