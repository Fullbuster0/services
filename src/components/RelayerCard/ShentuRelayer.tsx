import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const ShentuRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">Shentu Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/shentu-icon.svg"
            imgAlt1="Shentu"
            title1="Shentu"
            subtitleLink1="https://www.mintscan.io/shentu/address/shentu1238rpkaw44fys2cz27dng69anaugnkweh3ja3d"
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

export default ShentuRelayer;
