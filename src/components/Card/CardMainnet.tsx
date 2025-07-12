import Card from "./Card";
import type { ReactNode } from "react";

type Button = {
  label: string;
  url: string;
};
type Item = {
  imageUrl: string;
  title: string;
  chain_id?: string;
  buttons: Button[];
};

const items: Item[] = [
  {
    imageUrl: "/img/atomone-icon.svg",
    title: "Atomone",
    chain_id: "atomone-1",
    buttons: [
      { label: "Services", url: "/mainnets/atomone/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/atomone-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/atomone-mainnet/staking/atonevaloper17f2sq92lqjxwztemmy0aeave07xqg4qtdtp73l" },
    ],
  },
  {
    imageUrl: "/img/axone-icon.svg",
    title: "Axone",
    chain_id: "axone-1",
    buttons: [
      { label: "Services", url: "/mainnets/axone/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/axone-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/axone-mainnet/staking/axonevaloper1gf6gnfxqx0jkv86wft5zll7u5vp5ykf7uy5qwn" },
    ],
  },
  {
    imageUrl: "/img/babylon-icon.svg",
    title: "Babylon",
    chain_id: "bbn-1",
    buttons: [
      { label: "Services", url: "/mainnets/babylon/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/babylon-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/babylon-mainnet/staking/bbnvaloper1h6kuz9tc2vm3eflrpnmdvtw60e649etgu025n6" },
    ],
  },
  {
    imageUrl: "/img/fuel-icon.svg",
    title: "Fuel",
    chain_id: "seq-mainnet-1",
    buttons: [
      { label: "Services", url: "/mainnets/fuel/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/fuel-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/fuel-mainnet/staking/fuelsequencervaloper1fuevr6mctfshu8ay9h4g0snt9sqexdylngcf09" },
    ],
  },
  {
    imageUrl: "/img/hippo-icon.svg",
    title: "Hippo Protocol",
    chain_id: "hippo-protocol-1",
    buttons: [
      { label: "Services", url: "/mainnets/hippo/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/hippo-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/hippo-mainnet/staking/hippovaloper16rl9wdjrgf7lvv89v4r4fnx26kjev0wffyvlqe" },
    ],
  },
  {
    imageUrl: "/img/lumera-icon.svg",
    title: "Lumera",
    chain_id: "lumera-mainnet-1",
    buttons: [
      { label: "Services", url: "/mainnets/lumera/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/lumera-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/lumera-mainnet/staking/lumeravaloper13pyqmz2a7u3vw3c3y3rslps9g5ms9xd754x48w" },
    ],
  },
  {
    imageUrl: "/img/provenance-icon.svg",
    title: "Provenance",
    chain_id: "pio-mainnet-1",
    buttons: [
      { label: "Services", url: "/mainnets/provenance/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/provenance-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/provenance-mainnet/staking/pbvaloper1wgdk7896u5uduuawcwwfxpsd48ennclxvruskr" },
    ],
  },
  {
    imageUrl: "/img/seda-icon.svg",
    title: "Seda",
    chain_id: "seda-1",
    buttons: [
      { label: "Services", url: "/mainnets/seda/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/seda-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/seda-mainnet/staking/sedavaloper1z6yhhxt6mj46xk5vf0n2653dnnz3cn98fjyzg2" },
    ],
  },
  {
    imageUrl: "/img/shentu-icon.svg",
    title: "Shentu",
    chain_id: "shentu-2.2",
    buttons: [
      { label: "Services", url: "/mainnets/shentu/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/shentu-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/shentu-mainnet/staking/shentuvaloper1jrnns3nkkrzu7qn5xel088488jv6jmuafm2vdh" },
    ],
  },
  {
    imageUrl: "/img/synternet-icon.svg",
    title: "Synternet",
    chain_id: "synternet-1",
    buttons: [
      { label: "Services", url: "/mainnets/synternet/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/synternet-mainnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/synternet-mainnet/staking/syntvaloper198defu9l8m9dxxhqwmju0tycgfztmpg67cyuwm" },
    ],
  },
];

const CardMainnet: React.FC = () => {
  return (
    // <div className="container">
    <div className="row g-4">
      {items.map((item) => (
        <div className="col-12 col-md-6 col-lg-4 col-xxl-3 mb-4">
          <Card imageUrl={item.imageUrl} title={item.title} chain_id={item.chain_id} buttons={item.buttons} />
        </div>
      ))}
    </div>
    // </div>
  );
};

export default CardMainnet;
