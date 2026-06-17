import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./index.module.css";
import CardMainnet from "../components/Card/CardMainnet";
import CardTestnet from "../components/Card/CardTestnet";
import "@site/src/css/custom.css";

function HomepageHeader() {
  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroGlow} />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.logoWrapper}>
            <img
              src="/img/shazoe.jpg"
              alt="Shazoes Logo"
              className={styles.heroLogo}
            />
          </div>
          <h1 className={styles.heroTitle}>
            Trusted Blockchain Validator & Services Provider
          </h1>
          <p className={styles.heroTagline}>
            Shazoes is a validator that prioritizes stability, security, and
            maximum performance when supporting blockchain networks. With
            dependable infrastructure, we ensure that our nodes are constantly
            operational and provide public services to benefit the blockchain
            community.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>18</span>
              <span className={styles.statLabel}>Mainnet Chains</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>16</span>
              <span className={styles.statLabel}>Testnet Chains</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Uptime Commitment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomepageMain() {
  return (
    <div className={styles.mainSection}>
      <div className="container">
        <div className={styles.centerWrapper}>
          <Tabs className={styles.customTabs}>
            <TabItem
              className={styles.customTabsItem}
              value="mainnets"
              label="Mainnets"
              default
            >
              <CardMainnet />
            </TabItem>
            <TabItem
              className={styles.customTabsItem}
              value="testnets"
              label="Testnets"
            >
              <CardTestnet />
            </TabItem>
          </Tabs>
        </div>
      </div>
    </div>
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
    </Layout>
  );
}
