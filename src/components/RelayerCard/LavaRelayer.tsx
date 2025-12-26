import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const LavaRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">Lava Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/lava-icon.svg"
            imgAlt1="Lava"
            title1="Lava"
            subtitleLink1="https://lava.explorers.guru/account/lava@1238rpkaw44fys2cz27dng69anaugnkwe8appya"
            imgSrc2="/img/cosmoshub-icon.svg"
            imgAlt2="CosmosHub"
            title2="CosmosHub"
            subtitleLink2="https://www.mintscan.io/cosmos/address/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/lava-icon.svg"
            imgAlt1="Lava"
            title1="Lava"
            subtitleLink1="https://lava.explorers.guru/account/lava@1238rpkaw44fys2cz27dng69anaugnkwe8appya"
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

export default LavaRelayer;
