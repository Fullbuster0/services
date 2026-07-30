import React, { useEffect, useState, type ReactNode } from "react";

/**
 * Site-wide Root wrapper — animated background field.
 * Same family as explorer home aurora (orbs / sparks / rings / beams)
 * so motion is clearly visible, with services-tuned timing + lattice accent.
 */
export default function Root({ children }: { children: ReactNode }): ReactNode {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setPaused(true);
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        setPaused(false);
        resumeTimer = null;
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, []);

  return (
    <>
      <div
        className={`svc-aurora${paused ? " svc-aurora--paused" : ""}`}
        aria-hidden="true"
      >
        {/* big soft drifting orbs — primary motion (like explorer) */}
        <span className="svc-orb svc-orb-a" />
        <span className="svc-orb svc-orb-b" />
        <span className="svc-orb svc-orb-c" />
        <span className="svc-orb svc-orb-d" />
        <span className="svc-orb svc-orb-e" />
        <span className="svc-orb svc-orb-f" />
        <span className="svc-orb svc-orb-g" />
        <span className="svc-orb svc-orb-h" />
        {/* floating sparks */}
        <span className="svc-spark svc-spark-1" />
        <span className="svc-spark svc-spark-2" />
        <span className="svc-spark svc-spark-3" />
        <span className="svc-spark svc-spark-4" />
        <span className="svc-spark svc-spark-5" />
        <span className="svc-spark svc-spark-6" />
        <span className="svc-spark svc-spark-7" />
        <span className="svc-spark svc-spark-8" />
        {/* consensus-style pulse rings */}
        <span className="svc-ring svc-ring-1" />
        <span className="svc-ring svc-ring-2" />
        <span className="svc-ring svc-ring-3" />
        <span className="svc-ring svc-ring-4" />
        {/* diagonal light beams */}
        <span className="svc-beam svc-beam-1" />
        <span className="svc-beam svc-beam-2" />
        {/* services accent: soft perspective lattice under orbs */}
        <span className="svc-lattice" />
      </div>
      {children}
    </>
  );
}
