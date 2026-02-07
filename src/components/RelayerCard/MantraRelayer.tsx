import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const MantraRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">Mantra Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/mantra-icon.svg"
            imgAlt1="Mantra"
            title1="Mantra"
            subtitleLink1="https://www.mintscan.io/mantra/address/mantra1238rpkaw44fys2cz27dng69anaugnkwe5wuqq2"
            imgSrc2="/img/osmosis-icon.svg"
            imgAlt2="Osmosis"
            title2="Osmosis"
            subtitleLink2="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/mantra-icon.svg"
            imgAlt1="Mantra"
            title1="Mantra"
            subtitleLink1="https://www.mintscan.io/mantra/address/mantra1238rpkaw44fys2cz27dng69anaugnkwe5wuqq2"
            imgSrc2="/img/cosmoshub-icon.svg"
            imgAlt2="CosmosHub"
            title2="CosmosHub"
            subtitleLink2="https://www.mintscan.io/cosmos/address/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/mantra-icon.svg"
            imgAlt1="Mantra"
            title1="Mantra"
            subtitleLink1="https://www.mintscan.io/mantra/address/mantra1238rpkaw44fys2cz27dng69anaugnkwe5wuqq2"
            imgSrc2="/img/noble-icon.svg"
            imgAlt2="Noble"
            title2="Noble"
            subtitleLink2="https://www.mintscan.io/noble/address/noble1238rpkaw44fys2cz27dng69anaugnkwehxrvm7"
          />
        </div>
      </div>
    </div>
  );
};

export default MantraRelayer;
