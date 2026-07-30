import type { ReactNode } from "react";

/**
 * Site-wide Root wrapper.
 * Aurora / animated background removed — caused flicker and was barely visible.
 * Keep this file so Docusaurus swizzle still has a Root entrypoint for future shell work.
 */
export default function Root({ children }: { children: ReactNode }): ReactNode {
  return <>{children}</>;
}
