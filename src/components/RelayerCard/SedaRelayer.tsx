import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const SedaRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center">Seda Relayer Hub</h2>
      <div className="row margin-bottom--lg mb-4">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/seda-icon.svg"
            imgAlt1="Seda"
            title1="Seda"
            subtitleLink1="https://seda.explorers.guru/account/seda1238rpkaw44fys2cz27dng69anaugnkweft6uq3"
            imgSrc2="/img/osmosis-icon.svg"
            imgAlt2="Osmosis"
            title2="Osmosis"
            subtitleLink2="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
          />
        </div>
      </div>
    </div>
  );
};

export default SedaRelayer;
