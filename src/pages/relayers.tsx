import React from "react";
import Layout from "@theme/Layout";
import OsmosisRelayer from "../components/RelayerCard/OsmosisRelayer";
import CosmosHubRelayer from "../components/RelayerCard/CosmosHub";
import NobleRelayer from "../components/RelayerCard/NobleRelayer";
import AtomoneRelayer from "../components/RelayerCard/AtomoneRelayer";
import BabylonRelayer from "../components/RelayerCard/BabylonRelayer";
import LavaRelayer from "../components/RelayerCard/LavaRelayer";
import NillionRelayer from "../components/RelayerCard/NillionRelayer";
import MantraRelayer from "../components/RelayerCard/MantraRelayer";
import SedaRelayer from "../components/RelayerCard/SedaRelayer";
import ShentuRelayer from "../components/RelayerCard/ShentuRelayer";
import SynternetRelayer from "../components/RelayerCard/SynternetRelayer";
import TerraRelayer from "../components/RelayerCard/TerraRelayer";

export default function Hello() {
  return (
    <Layout title="Relayer" description="IBC Relaying">
      <div className="container">
        <h1 className="text--center margin-top--xl">IBC Relaying</h1>
        <p className="margin-bottom--xl text--center text--semibold text--primary">If you want to support our work, please Delegate with us!</p>
        <OsmosisRelayer />
        <CosmosHubRelayer />
        <NobleRelayer />
        <AtomoneRelayer />
        <BabylonRelayer />
        <LavaRelayer />
        <MantraRelayer />
        <NillionRelayer />
        <SedaRelayer />
        <ShentuRelayer />
        <SynternetRelayer />
        <TerraRelayer />
      </div>
    </Layout>
  );
}
