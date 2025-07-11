import React, { useEffect, useState } from "react";

export default function SnapshotCard({
  chain,
  jsonUrl,
  snapshotUrlPrefix,
  db = "goleveldb",
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [fontSize, setFontSize] = useState("0.9rem");

  useEffect(() => {
    const fetchData = () => {
      fetch(`${jsonUrl}?_=${Date.now()}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Fetch error");
          }
          return res.json();
        })
        .then((json) => {
          setData(json);
          setError(false);
        })
        .catch(() => {
          setError(true);
        });
    };

    fetchData(); // initial fetch on mount

    const interval = setInterval(fetchData, 30000); // refetch every 30s

    return () => clearInterval(interval); // cleanup on unmount
  }, [jsonUrl]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 315) setFontSize("0.4rem");
      else if (window.innerWidth <= 355) setFontSize("0.45rem");
      else if (window.innerWidth <= 380) setFontSize("0.5rem");
      else if (window.innerWidth <= 415) setFontSize("0.55rem");
      else if (window.innerWidth <= 455) setFontSize("0.6rem");
      else if (window.innerWidth <= 555) setFontSize("0.7rem");
      else setFontSize("0.8rem");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) return null;

  const height = data.height ?? "-";
  const size = data.size ?? "-";
  const timestampMs = new Date(data.timestamp).getTime();
  const diffMs = Date.now() - (isNaN(timestampMs) ? 0 : timestampMs);
  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const formattedDiff =
    hours > 0 ? `${hours}h ${minutes}m ago` : `${minutes} minutes ago`;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "0.5rem",
        borderRadius: "8px",
        marginTop: "0.5rem",
        fontSize,
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <span>
        Height: <strong>{height}</strong>
      </span>
      <span>|</span>
      <span>
        Last updated: <strong>{formattedDiff}</strong>
      </span>
      <span>|</span>
      <span>
        Size: <strong>{size}</strong>
      </span>
      <span>|</span>
      <span>
        db: <strong>{db}</strong>
      </span>
    </div>
  );
}
