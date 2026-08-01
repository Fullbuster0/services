import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import hero from "./index.module.css";
import styles from "./relayers.module.css";
import RelayerCard from "../components/RelayerCard/RelayerCard";
import {
  relayerHubs,
  totalRoutes,
  uniqueChainCount,
} from "../components/RelayerCard/relayerData";
import "@site/src/css/custom.css";

function RelayerHero() {
  return (
    <div className={hero.heroBanner}>
      <div className="container">
        <div className={hero.heroContent}>
          <div className={hero.heroBadge}>
            <span className={hero.heroBadgeDot} aria-hidden="true" />
            IBC · Relayer Infrastructure
          </div>
          <h1 className={hero.heroTitle}>
            Keeping IBC packets moving across chains
          </h1>
          <p className={hero.heroTagline}>
            Shazoes operates dedicated, monitored relayers that move IBC
            packets between networks around the clock. Every route below is
            backed by its own relayer wallet — verifiable on-chain. If you
            want to support our work, please delegate with us!
          </p>
          <div className={hero.statsRow}>
            <div className={hero.statGlass} data-hue="blue">
              <span className={hero.statLabel}>Relayer Hubs</span>
              <span className={hero.statNumber}>{relayerHubs.length}</span>
            </div>
            <div className={hero.statGlass} data-hue="violet">
              <span className={hero.statLabel}>Active Routes</span>
              <span className={hero.statNumber}>{totalRoutes}</span>
            </div>
            <div className={hero.statGlass} data-hue="emerald">
              <span className={hero.statLabel}>Chains Connected</span>
              <span className={hero.statNumber}>{uniqueChainCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelayerMain() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filteredHubs = useMemo(
    () =>
      relayerHubs
        .map((hub) => ({
          hub,
          routes: hub.routes.filter(
            (target) =>
              !q ||
              hub.chain.name.toLowerCase().includes(q) ||
              target.name.toLowerCase().includes(q),
          ),
        }))
        .filter((entry) => entry.routes.length > 0),
    [q],
  );

  const shownRoutes = filteredHubs.reduce(
    (n, entry) => n + entry.routes.length,
    0,
  );

  return (
    <div className={hero.mainSection}>
      <div className="container">
        <div className={hero.sectionHead}>
          <div>
            <div className={hero.sectionKicker}>Relayers</div>
            <h2 className={hero.sectionTitle}>Active IBC routes</h2>
          </div>
          <p className={hero.sectionHint}>
            Grouped by relayer hub — each card links to the relayer wallets on
            both sides of the route.
          </p>
        </div>

        <div className={hero.chainSearchWrap}>
          <label className={hero.chainSearchLabel} htmlFor="relayer-search">
            Search routes
          </label>
          <div className={hero.chainSearchBox}>
            <span className={hero.chainSearchIcon} aria-hidden="true">
              ⌕
            </span>
            <input
              id="relayer-search"
              type="search"
              className={hero.chainSearchInput}
              placeholder="Search by chain name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {q ? (
              <button
                type="button"
                className={hero.chainSearchClear}
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </div>
          {q ? (
            <p className={hero.chainSearchMeta} role="status">
              Showing {shownRoutes}/{totalRoutes} routes across{" "}
              {filteredHubs.length} hub{filteredHubs.length === 1 ? "" : "s"}
            </p>
          ) : (
            <p className={hero.chainSearchMeta}>
              Filter routes by chain name — hubs without matches are hidden.
            </p>
          )}
        </div>

        {filteredHubs.map(({ hub, routes }) => (
          <section key={hub.id} className={styles.hubSection}>
            <div className={styles.hubHeader}>
              <img
                src={hub.chain.icon}
                alt=""
                className={styles.hubIcon}
                loading="lazy"
              />
              <h2 className={styles.hubName}>
                {hub.chain.name} Relayer Hub
              </h2>
              <span className={styles.hubCount}>
                {routes.length} route{routes.length === 1 ? "" : "s"}
              </span>
              <a
                className={styles.hubWallet}
                href={hub.chain.walletUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hub wallet ↗
              </a>
            </div>
            <div className={styles.routeGrid}>
              {routes.map((target) => (
                <RelayerCard
                  key={`${hub.id}-${target.name}`}
                  imgSrc1={hub.chain.icon}
                  imgAlt1={hub.chain.name}
                  title1={hub.chain.name}
                  subtitleLink1={hub.chain.walletUrl}
                  imgSrc2={target.icon}
                  imgAlt2={target.name}
                  title2={target.name}
                  subtitleLink2={target.walletUrl}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredHubs.length === 0 ? (
          <div className={styles.emptyState}>
            No routes match <strong>“{query.trim()}”</strong> — try a chain
            name like Osmosis or Terra.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Relayers(): ReactNode {
  return (
    <Layout
      title="Relayers"
      description="Shazoes IBC relayer infrastructure — dedicated relayers moving packets across Cosmos chains 24/7."
    >
      <RelayerHero />
      <RelayerMain />
    </Layout>
  );
}
