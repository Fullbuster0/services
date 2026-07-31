import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./index.module.css";
import CardMainnet from "../components/Card/CardMainnet";
import CardTestnet from "../components/Card/CardTestnet";
import CardArchive from "../components/Card/CardArchive";
import { mainnetItems } from "../components/Card/CardMainnet";
import { testnetItems } from "../components/Card/CardTestnet";
import { archiveItems } from "../components/Card/CardArchive";
import { FaShieldAlt, FaRocket, FaHeartbeat } from "react-icons/fa";
import "@site/src/css/custom.css";

function matchChain(
  item: { title: string; chain_id?: string },
  q: string,
): boolean {
  if (!q) return true;
  const s = q.toLowerCase().trim();
  return (
    item.title.toLowerCase().includes(s) ||
    (item.chain_id ? item.chain_id.toLowerCase().includes(s) : false)
  );
}

function HomepageHeader() {
  return (
    <div className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} aria-hidden="true" />
            Validator · Infrastructure · Public Services
          </div>
          <h1 className={styles.heroTitle}>
            Trusted Blockchain Validator &amp; Services Provider
          </h1>
          <p className={styles.heroTagline}>
            Shazoes is a validator that prioritizes stability, security, and
            maximum performance when supporting blockchain networks. With
            dependable infrastructure, we ensure that our nodes are constantly
            operational and provide public services to benefit the blockchain
            community.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statGlass} data-hue="blue">
              <span className={styles.statLabel}>Mainnet Chains</span>
              <span className={styles.statNumber}>{mainnetItems.length}</span>
            </div>
            <div className={styles.statGlass} data-hue="violet">
              <span className={styles.statLabel}>Testnet Chains</span>
              <span className={styles.statNumber}>{testnetItems.length}</span>
            </div>
            <div className={styles.statGlass} data-hue="slate">
              <span className={styles.statLabel}>Archive</span>
              <span className={styles.statNumber}>{archiveItems.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomepageMain() {
  const [query, setQuery] = useState("");
  const [archiveOrigin, setArchiveOrigin] = useState<
    "all" | "mainnet" | "testnet"
  >("all");
  const q = query.trim();

  const mainnetCount = useMemo(
    () => mainnetItems.filter((i) => matchChain(i, q)).length,
    [q],
  );
  const testnetCount = useMemo(
    () => testnetItems.filter((i) => matchChain(i, q)).length,
    [q],
  );
  const archiveFiltered = useMemo(
    () =>
      archiveItems.filter((i) => {
        if (archiveOrigin !== "all" && i.networkType !== archiveOrigin) {
          return false;
        }
        return matchChain(i, q);
      }),
    [q, archiveOrigin],
  );
  const archiveCount = archiveFiltered.length;
  const archiveMainnetTotal = useMemo(
    () => archiveItems.filter((i) => i.networkType === "mainnet").length,
    [],
  );
  const archiveTestnetTotal = useMemo(
    () => archiveItems.filter((i) => i.networkType === "testnet").length,
    [],
  );

  const tabMain = q
    ? `Mainnets · ${mainnetCount}/${mainnetItems.length}`
    : `Mainnets · ${mainnetItems.length}`;
  const tabTest = q
    ? `Testnets · ${testnetCount}/${testnetItems.length}`
    : `Testnets · ${testnetItems.length}`;
  const tabArch =
    q || archiveOrigin !== "all"
      ? `Archive · ${archiveCount}/${archiveItems.length}`
      : `Archive · ${archiveItems.length}`;

  return (
    <div className={styles.mainSection}>
      <div className="container">
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.sectionKicker}>Networks</div>
            <h2 className={styles.sectionTitle}>Supported chains</h2>
          </div>
          <p className={styles.sectionHint}>
            Active networks we validate, plus archived docs for chains we no
            longer operate.
          </p>
        </div>

        <div className={styles.chainSearchWrap}>
          <label className={styles.chainSearchLabel} htmlFor="chain-search">
            Search chains
          </label>
          <div className={styles.chainSearchBox}>
            <span className={styles.chainSearchIcon} aria-hidden="true">
              ⌕
            </span>
            <input
              id="chain-search"
              type="search"
              className={styles.chainSearchInput}
              placeholder="Search by name or chain id…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {q ? (
              <button
                type="button"
                className={styles.chainSearchClear}
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </div>
          {q ? (
            <p className={styles.chainSearchMeta} role="status">
              Showing matches across tabs · Mainnet {mainnetCount} · Testnet{" "}
              {testnetCount} · Archive {archiveCount}
            </p>
          ) : (
            <p className={styles.chainSearchMeta}>
              Filter cards by chain name or chain id (works on every tab).
            </p>
          )}
        </div>

        <div className={styles.centerWrapper}>
          <Tabs className={styles.customTabs}>
            <TabItem
              className={styles.customTabsItem}
              value="mainnets"
              label={tabMain}
              default
            >
              <CardMainnet filterQuery={q} />
            </TabItem>
            <TabItem
              className={styles.customTabsItem}
              value="testnets"
              label={tabTest}
            >
              <CardTestnet filterQuery={q} />
            </TabItem>
            <TabItem
              className={styles.customTabsItem}
              value="archive"
              label={tabArch}
            >
              <div className={styles.archiveFilterBar}>
                <label
                  className={styles.archiveFilterLabel}
                  htmlFor="archive-origin-filter"
                >
                  Origin
                </label>
                <select
                  id="archive-origin-filter"
                  className={styles.archiveFilterSelect}
                  value={archiveOrigin}
                  onChange={(e) =>
                    setArchiveOrigin(
                      e.target.value as "all" | "mainnet" | "testnet",
                    )
                  }
                >
                  <option value="all">
                    All Archive · {archiveItems.length}
                  </option>
                  <option value="mainnet">
                    Mainnet origin · {archiveMainnetTotal}
                  </option>
                  <option value="testnet">
                    Testnet origin · {archiveTestnetTotal}
                  </option>
                </select>
                <span className={styles.archiveFilterHint}>
                  Showing {archiveCount}
                  {q ? " match" + (archiveCount === 1 ? "" : "es") : " chain" + (archiveCount === 1 ? "" : "s")}
                </span>
              </div>
              <CardArchive filterQuery={q} originFilter={archiveOrigin} />
            </TabItem>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function WhyShazoes() {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Secure & Reliable",
      description:
        "Reliable infrastructure with enterprise-grade security measures.",
    },
    {
      icon: <FaRocket />,
      title: "High Performance",
      description:
        "Optimized nodes with maximum uptime and fast synchronization.",
    },
    {
      icon: <FaHeartbeat />,
      title: "Community Tools & Guides",
      description:
        "Comprehensive tools and guides for the blockchain community.",
    },
  ];

  return (
    <section className={styles.whySection}>
      <div className="container">
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.sectionKicker}>Why Shazoes</div>
            <h2 className={styles.whyTitle}>Built for operators &amp; community</h2>
          </div>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Shazoes — Blockchain Validator & Services Provider"
      description="Shazoes is a validator that prioritizes stability, security, and maximum performance when supporting blockchain networks.  With dependable infrastructure, we ensure that our nodes are constantly operational and provide public services to benefit the blockchain community."
    >
      <HomepageHeader />
      <HomepageMain />
      <WhyShazoes />
    </Layout>
  );
}
