import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const TerraRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">Terra Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/terra-icon.svg"
            imgAlt1="Terra"
            title1="Terra"
            subtitleLink1="https://www.mintscan.io/terra/address/terra1238rpkaw44fys2cz27dng69anaugnkweepvyps"
            imgSrc2="/img/osmosis-icon.svg"
            imgAlt2="Osmosis"
            title2="Osmosis"
            subtitleLink2="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/terra-icon.svg"
            imgAlt1="Terra"
            title1="Terra"
            subtitleLink1="https://www.mintscan.io/terra/address/terra1238rpkaw44fys2cz27dng69anaugnkweepvyps"
            imgSrc2="/img/cosmoshub-icon.svg"
            imgAlt2="CosmosHub"
            title2="CosmosHub"
            subtitleLink2="https://www.mintscan.io/cosmos/address/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs"
          />
        </div>
      </div>
    </div>
  );
};

export default TerraRelayer;
