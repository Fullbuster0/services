import React, { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Site-wide Root — animated aurora background.
 * Portaled to document.body so it is NEVER a sibling that can
 * interfere with Docusaurus navbar/sidebar stacking context.
 * Orbs only animate; text/UI stay completely static.
 */
export default function Root({ children }: { children: ReactNode }): ReactNode {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const field = (
    <div
      className={`svc-aurora${paused ? " svc-aurora--paused" : ""}`}
      aria-hidden="true"
    >
      <span className="svc-orb svc-orb-a" />
      <span className="svc-orb svc-orb-b" />
      <span className="svc-orb svc-orb-c" />
      <span className="svc-orb svc-orb-d" />
      <span className="svc-orb svc-orb-e" />
      <span className="svc-orb svc-orb-f" />
      <span className="svc-orb svc-orb-g" />
      <span className="svc-orb svc-orb-h" />
      <span className="svc-spark svc-spark-1" />
      <span className="svc-spark svc-spark-2" />
      <span className="svc-spark svc-spark-3" />
      <span className="svc-spark svc-spark-4" />
      <span className="svc-spark svc-spark-5" />
      <span className="svc-spark svc-spark-6" />
      <span className="svc-spark svc-spark-7" />
      <span className="svc-spark svc-spark-8" />
      <span className="svc-ring svc-ring-1" />
      <span className="svc-ring svc-ring-2" />
      <span className="svc-ring svc-ring-3" />
      <span className="svc-ring svc-ring-4" />
      <span className="svc-beam svc-beam-1" />
      <span className="svc-beam svc-beam-2" />
      <span className="svc-lattice" />
    </div>
  );

  return (
    <>
      {mounted && typeof document !== "undefined"
        ? createPortal(field, document.body)
        : null}
      {children}
    </>
  );
}
