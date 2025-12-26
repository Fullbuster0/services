import type { ReactNode } from "react";
import RelayerCard from "./RelayerCard";

const OsmosisRelayer: React.FC = () => {
  return (
    <div className="container">
      <h2 className="text--center mb-4">Osmosis Relayer Hub</h2>
      <div className="row margin-bottom--lg">
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/osmosis-icon.svg"
            imgAlt1="Osmosis"
            title1="Osmosis"
            subtitleLink1="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
            imgSrc2="/img/atomone-icon.svg"
            imgAlt2="Atomone"
            title2="Atomone"
            subtitleLink2="https://www.mintscan.io/atomone/address/atone1238rpkaw44fys2cz27dng69anaugnkwe392r4g"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/osmosis-icon.svg"
            imgAlt1="Osmosis"
            title1="Osmosis"
            subtitleLink1="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
            imgSrc2="/img/babylon-icon.svg"
            imgAlt2="Babylon"
            title2="Babylon"
            subtitleLink2="https://www.mintscan.io/babylon/address/bbn1238rpkaw44fys2cz27dng69anaugnkwegm84uf"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/osmosis-icon.svg"
            imgAlt1="Osmosis"
            title1="Osmosis"
            subtitleLink1="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
            imgSrc2="/img/lava-icon.svg"
            imgAlt2="Lava"
            title2="Lava"
            subtitleLink2="https://lava.explorers.guru/account/lava@1238rpkaw44fys2cz27dng69anaugnkwe8appya"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/osmosis-icon.svg"
            imgAlt1="Osmosis"
            title1="Osmosis"
            subtitleLink1="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
            imgSrc2="/img/seda-icon.svg"
            imgAlt2="Seda"
            title2="Seda"
            subtitleLink2="https://seda.explorers.guru/account/seda1238rpkaw44fys2cz27dng69anaugnkweft6uq3"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/osmosis-icon.svg"
            imgAlt1="Osmosis"
            title1="Osmosis"
            subtitleLink1="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
            imgSrc2="/img/shentu-icon.svg"
            imgAlt2="Shentu"
            title2="Shentu"
            subtitleLink2="https://www.mintscan.io/shentu/address/shentu1238rpkaw44fys2cz27dng69anaugnkweh3ja3d"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4 mb-4">
          {" "}
          <RelayerCard
            imgSrc1="/img/osmosis-icon.svg"
            imgAlt1="Osmosis"
            title1="Osmosis"
            subtitleLink1="https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z"
            imgSrc2="/img/synternet-icon.svg"
            imgAlt2="Synternet"
            title2="Synternet"
            subtitleLink2="https://explorer.shazoes.xyz/synternet-mainnet/account/synt1238rpkaw44fys2cz27dng69anaugnkwesz9f8c"
          />
        </div>
      </div>
    </div>
  );
};

export default OsmosisRelayer;
