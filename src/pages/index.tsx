import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./index.module.css";
import CardMainnet from "../components/Card/CardMainnet";
import CardTestnet from "../components/Card/CardTestnet";
import { mainnetItems } from "../components/Card/CardMainnet";
import { testnetItems } from "../components/Card/CardTestnet";
import { FaShieldAlt, FaRocket, FaHeartbeat } from "react-icons/fa";
import "@site/src/css/custom.css";

function HomepageHeader() {
  return (
    <div className={styles.heroBanner}>
      {/* Floating gradient blobs */}
      <div className={styles.floatingBlob1} />
      <div className={styles.floatingBlob2} />
      <div className={styles.floatingBlob3} />
      <div className={styles.heroGlow} />
      <div className="container">
        <div className={styles.heroContent}>
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
            <div className={styles.statGlass}>
              <span className={styles.statNumber}>{mainnetItems.length}</span>
              <span className={styles.statLabel}>Mainnet Chains</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statGlass}>
              <span className={styles.statNumber}>{testnetItems.length}</span>
              <span className={styles.statLabel}>Testnet Chains</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statGlass}>
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
        <h2 className={styles.whyTitle}>Why Shazoes?</h2>
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
      <WhyShazoes />
      <HomepageMain />
    </Layout>
  );
}
