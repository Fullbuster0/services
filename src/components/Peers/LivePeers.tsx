import React, { useEffect, useState } from "react";
import CodeBlock from "@theme/CodeBlock";

interface LivePeersProps {
  rpc: string;
  homeFolder?: string;
  binaryName?: string;
  maxPeers?: number;
}

export default function LivePeers({ rpc, homeFolder = "homeFolder", binaryName = "binaryName", maxPeers = 25 }: LivePeersProps) {
  const [peersOnly, setPeersOnly] = useState("");
  const [scriptOutput, setScriptOutput] = useState("");
  const [peerCount, setPeerCount] = useState(0); // total dari RPC
  const [usedPeerCount, setUsedPeerCount] = useState(0); // yang digunakan
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
        const allPeers = (data.result.peers || []).map((peer: any) => {
          const id = peer?.node_info?.id;
          const ip = peer?.remote_ip;
          const port = peer?.node_info?.listen_addr?.split(":").pop();
          return `${id}@${ip}:${port}`;
        });

        setPeerCount(allPeers.length);

        const shuffledPeers = shuffleArray(allPeers).slice(0, maxPeers);
        setUsedPeerCount(shuffledPeers.length); // Ini yang ditampilkan

        const peersString = shuffledPeers.join(",");
        setPeersOnly(peersString);

        const script = `PEERS="${peersString}"
sed -i 's|^persistent_peers *=.*|persistent_peers = "'$PEERS'"|' $HOME/${homeFolder}/config/config.toml

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
    return <CodeBlock language="bash">Failed to fetch peer data. RPC may be down, or there is a CORS/network issue.</CodeBlock>;
  }

  return (
    <>
      <p>
        Number of active Peers <strong>{usedPeerCount}</strong>
      </p>
      <CodeBlock language="bash">{peersOnly || "Memuat data..."}</CodeBlock>
      <CodeBlock language="bash">{scriptOutput || "Memuat skrip konfigurasi..."}</CodeBlock>
    </>
  );
}
