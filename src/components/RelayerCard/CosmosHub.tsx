import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const CosmosHubRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">CosmosHub Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/cosmoshub-icon.svg"
            imgAlt1="CosmosHub"
            title1="CosmosHub"
            subtitleLink1="https://www.mintscan.io/cosmos/address/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs"
            imgSrc2="/img/babylon-icon.svg"
            imgAlt2="Babylon"
            title2="Babylon"
            subtitleLink2="https://www.mintscan.io/babylon/address/bbn1238rpkaw44fys2cz27dng69anaugnkwegm84uf"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/cosmoshub-icon.svg"
            imgAlt1="CosmosHub"
            title1="CosmosHub"
            subtitleLink1="https://www.mintscan.io/cosmos/address/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs"
            imgSrc2="/img/lava-icon.svg"
            imgAlt2="Lava"
            title2="Lava"
            subtitleLink2="https://lava.explorers.guru/account/lava@1238rpkaw44fys2cz27dng69anaugnkwe8appya"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/cosmoshub-icon.svg"
            imgAlt1="CosmosHub"
            title1="CosmosHub"
            subtitleLink1="https://www.mintscan.io/cosmos/address/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs"
            imgSrc2="/img/nillion-icon.svg"
            imgAlt2="Nillion"
            title2="Nillion"
            subtitleLink2="https://www.mintscan.io/nillion/address/nillion1238rpkaw44fys2cz27dng69anaugnkwey9ghgn"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          <RelayerCard
            imgSrc1="/img/cosmoshub-icon.svg"
            imgAlt1="CosmosHub"
            title1="CosmosHub"
            subtitleLink1="https://www.mintscan.io/cosmos/address/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs"
            imgSrc2="/img/seda-icon.svg"
            imgAlt2="Seda"
            title2="Seda"
            subtitleLink2="https://seda.explorers.guru/account/seda1238rpkaw44fys2cz27dng69anaugnkweft6uq3"
          />
        </div>
      </div>
    </div>
  );
};

export default CosmosHubRelayer;
