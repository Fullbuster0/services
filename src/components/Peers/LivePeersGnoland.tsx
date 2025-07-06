import React, { useEffect, useState } from "react";
import CodeBlock from "@theme/CodeBlock";

interface LivePeersProps {
  rpc: string;
  homeFolder?: string;
  binaryName?: string;
  maxPeers?: number;
}

export default function LivePeersGnoland({ rpc, homeFolder = "homeFolder", binaryName = "binaryName", maxPeers = 25 }: LivePeersProps) {
  const [peersOnly, setPeersOnly] = useState("");
  const [scriptOutput, setScriptOutput] = useState("");
  const [peerCount, setPeerCount] = useState(0);
  const [usedPeerCount, setUsedPeerCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!rpc) return;

    async function fetchPeers() {
      try {
        const response = await fetch(`${rpc}/net_info`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const allPeers = (data.result.peers || []).map((peer: any) => peer?.node_info?.net_address);

        setPeerCount(allPeers.length);

        const shuffledPeers = shuffleArray(allPeers).slice(0, maxPeers);
        setUsedPeerCount(shuffledPeers.length);

        const peersString = shuffledPeers.join(",");
        setPeersOnly(peersString);

        const script = `cd $HOME
gnoland config set p2p.persistent_peers ${peersString}

sudo systemctl restart ${binaryName} && sudo journalctl -u ${binaryName} -f --no-hostname -o cat`;

        setScriptOutput(script);
      } catch (err) {
        console.error("Gagal mengambil data peer:", err);
        setError(true);
      }
    }

    fetchPeers();
  }, [rpc, homeFolder, binaryName, maxPeers]);

  function shuffleArray(array: string[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  if (error) {
    return <CodeBlock language="bash">Gagal mengambil data peer. RPC mungkin tidak aktif, atau terjadi masalah CORS/jaringan.</CodeBlock>;
  }

  return (
    <>
      <p>
        Number of active Peers: <strong>{usedPeerCount}</strong>
      </p>
      <CodeBlock language="bash">{peersOnly || "Memuat data..."}</CodeBlock>
      <CodeBlock language="bash">{scriptOutput || "Memuat skrip konfigurasi..."}</CodeBlock>
    </>
  );
}
