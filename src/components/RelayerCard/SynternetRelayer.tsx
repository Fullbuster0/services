import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const SynternetRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">Synternet Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/synternet-icon.svg"
            imgAlt1="Synternet"
            title1="Synternet"
            subtitleLink1="https://explorer.shazoes.xyz/synternet-mainnet/account/synt1238rpkaw44fys2cz27dng69anaugnkwesz9f8c"
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

export default SynternetRelayer;
