import React, { useEffect, useState, type ReactNode } from "react";

/**
 * Site-wide Root wrapper.
 * Services mesh field = brand motion for validator/infra site.
 * Intentionally different from explorer aurora (orbs/sparks/rings/beams):
 * constellation nodes + lattice + radar arcs + light columns.
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
        className={`svc-mesh${paused ? " svc-mesh--paused" : ""}`}
        aria-hidden="true"
      >
        <span className="svc-mesh-lattice" />
        <span className="svc-mesh-haze svc-mesh-haze-a" />
        <span className="svc-mesh-haze svc-mesh-haze-b" />
        <span className="svc-mesh-haze svc-mesh-haze-c" />
        <span className="svc-mesh-column svc-mesh-column-1" />
        <span className="svc-mesh-column svc-mesh-column-2" />
        <span className="svc-mesh-column svc-mesh-column-3" />
        <span className="svc-mesh-arc svc-mesh-arc-1" />
        <span className="svc-mesh-arc svc-mesh-arc-2" />
        <span className="svc-mesh-arc svc-mesh-arc-3" />
        <span className="svc-mesh-node svc-mesh-node-1" />
        <span className="svc-mesh-node svc-mesh-node-2" />
        <span className="svc-mesh-node svc-mesh-node-3" />
        <span className="svc-mesh-node svc-mesh-node-4" />
        <span className="svc-mesh-node svc-mesh-node-5" />
        <span className="svc-mesh-node svc-mesh-node-6" />
        <span className="svc-mesh-node svc-mesh-node-7" />
        <span className="svc-mesh-node svc-mesh-node-8" />
        <span className="svc-mesh-link svc-mesh-link-1" />
        <span className="svc-mesh-link svc-mesh-link-2" />
        <span className="svc-mesh-link svc-mesh-link-3" />
        <span className="svc-mesh-link svc-mesh-link-4" />
        <span className="svc-mesh-scan" />
      </div>
      {children}
    </>
  );
}
