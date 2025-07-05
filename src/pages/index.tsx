import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./index.module.css";
import CardMainnet from "../components/Card/CardMainnet";
import CardTestnet from "../components/Card/CardTestnet";
import "@site/src/css/custom.css"; // Pastikan path ini sesuai

function HomepageHeader() {
  return (
    <div className="container">
      <div className="margin-top--xl text--center">
        <h1>Trusted Blockhain Validator & Services Provider.</h1>
        <i>
          Shazoes is a validator that prioritizes stability, security, and maximum performance when supporting blockchain networks. With dependable infrastructure, we ensure that our nodes are constantly operational and provide public
          services to benefit the blockchain community.
        </i>
      </div>
    </div>
  );
}

function HomepageMain() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className="container">
      <div className={styles.centerWrapper}>
        <Tabs className={styles.customTabs}>
          <TabItem className={styles.customTabsItem} value="mainnets" label="Mainnets" default>
            <CardMainnet />
          </TabItem>
          <TabItem className={styles.customTabsItem} value="testnets" label="Testnets">
            <CardTestnet />
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Shazoes is a validator that prioritizes stability, security, and maximum performance when supporting blockchain networks.  With dependable infrastructure, we ensure that our nodes are constantly operational and provide public services to benefit the blockchain community. <head />"
    >
      <HomepageHeader />
      <HomepageMain />
    </Layout>
  );
}
