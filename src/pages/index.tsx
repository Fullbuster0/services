import type { ReactNode } from "react";
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
        <div className={styles.centerWrapper}>
          <Tabs className={styles.customTabs}>
            <TabItem
              className={styles.customTabsItem}
              value="mainnets"
              label={`Mainnets · ${mainnetItems.length}`}
              default
            >
              <CardMainnet />
            </TabItem>
            <TabItem
              className={styles.customTabsItem}
              value="testnets"
              label={`Testnets · ${testnetItems.length}`}
            >
              <CardTestnet />
            </TabItem>
            <TabItem
              className={styles.customTabsItem}
              value="archive"
              label={`Archive · ${archiveItems.length}`}
            >
              <CardArchive />
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
