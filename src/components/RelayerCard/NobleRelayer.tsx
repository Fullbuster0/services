import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const NobleRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">Noble Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/noble-icon.svg"
            imgAlt1="Noble"
            title1="Noble"
            subtitleLink1="https://www.mintscan.io/noble/address/noble1238rpkaw44fys2cz27dng69anaugnkwehxrvm7"
            imgSrc2="/img/babylon-icon.svg"
            imgAlt2="Babylon"
            title2="Babylon"
            subtitleLink2="https://www.mintscan.io/babylon/address/bbn1238rpkaw44fys2cz27dng69anaugnkwegm84uf"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/noble-icon.svg"
            imgAlt1="Noble"
            title1="Noble"
            subtitleLink1="https://www.mintscan.io/noble/address/noble1238rpkaw44fys2cz27dng69anaugnkwehxrvm7"
            imgSrc2="/img/mantra-icon.svg"
            imgAlt2="Mantra"
            title2="Mantra"
            subtitleLink2="https://www.mintscan.io/mantra/address/mantra1238rpkaw44fys2cz27dng69anaugnkwe5wuqq2"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/noble-icon.svg"
            imgAlt1="Noble"
            title1="Noble"
            subtitleLink1="https://www.mintscan.io/noble/address/noble1238rpkaw44fys2cz27dng69anaugnkwehxrvm7"
            imgSrc2="/img/terra-icon.svg"
            imgAlt2="Terra"
            title2="Terra"
            subtitleLink2="https://www.mintscan.io/terra/address/terra1238rpkaw44fys2cz27dng69anaugnkweepvyps"
          />
        </div>
      </div>
    </div>
  );
};

export default NobleRelayer;
