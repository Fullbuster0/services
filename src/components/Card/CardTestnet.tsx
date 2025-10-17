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
    imageUrl: "/img/airchain-icon.svg",
    title: "airchain",
    chain_id: "varanasi-1",
    buttons: [
      { label: "Services", url: "/testnets/airchain/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/airchain-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/airchain-testnet" },
    ],
  },
  {
    imageUrl: "/img/atomone-icon.svg",
    title: "Atomone",
    chain_id: "atomone-testnet-1",
    buttons: [
      { label: "Services", url: "/testnets/atomone/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/atomone-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/atomone-testnet" },
    ],
  },
  {
    imageUrl: "/img/axone-icon.svg",
    title: "Axone",
    chain_id: "axone-dentrite-1",
    buttons: [
      { label: "Services", url: "/testnets/axone/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/axone-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/axone-testnet" },
    ],
  },
  {
    imageUrl: "/img/cardchain.png",
    title: "Cardchain",
    chain_id: "cardtestnet-12",
    buttons: [
      { label: "Services", url: "/testnets/cardchain/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/cardchain-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/cardchain-testnet" },
    ],
  },
  {
    imageUrl: "/img/empeiria-icon.svg",
    title: "Empeiria",
    chain_id: "empe-testnet-2",
    buttons: [
      { label: "Services", url: "/testnets/empeiria/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/empeiria-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/empeiria-testnet" },
    ],
  },
  {
    imageUrl: "/img/fuel-icon.svg",
    title: "Fuel",
    chain_id: "seq-testnet-2",
    buttons: [
      { label: "Services", url: "/testnets/fuel/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/fuel-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/fuel-testnet" },
    ],
  },
  {
    imageUrl: "/img/gnoland-icon.svg",
    title: "Gnoland",
    chain_id: "test9",
    buttons: [
      { label: "Services", url: "/testnets/gnoland/" },
      { label: "Explorer", url: "https://gnoscan.io" },
      { label: "Delegate", url: "https://gnoscan.io" },
    ],
  },
  {
    imageUrl: "/img/lumera-icon.svg",
    title: "Lumera",
    chain_id: "lumera-testnet-2",
    buttons: [
      { label: "Services", url: "/testnets/lumera/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/lumera-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/lumera-testnet" },
    ],
  },
  {
    imageUrl: "/img/seda-icon.svg",
    title: "Seda",
    chain_id: "seda-1-testnet",
    buttons: [
      { label: "Services", url: "/testnets/seda/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/seda-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/seda-testnet" },
    ],
  },
  ,
  {
    imageUrl: "/img/story-icon.svg",
    title: "story",
    chain_id: "aeneid",
    buttons: [
      { label: "Services", url: "/testnets/story/" },
      { label: "Explorer", url: "https://aeneid.staking.story.foundation" },
      { label: "Delegate", url: "https://aeneid.staking.story.foundation" },
    ],
  },
  {
    imageUrl: "/img/structs-icon.svg",
    title: "Structs",
    chain_id: "structstestnet-101",
    buttons: [
      { label: "Services", url: "/testnets/structs/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/structs-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/structs-testnet" },
    ],
  },
  {
    imageUrl: "/img/symphony-icon.svg",
    title: "Symphony",
    chain_id: "symphony-1",
    buttons: [
      { label: "Services", url: "/testnets/symphony/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/symphony-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/symphony-testnet" },
    ],
  },
  {
    imageUrl: "/img/tacchain-icon.svg",
    title: "Tacchain",
    chain_id: "tacchain_2391-1",
    buttons: [
      { label: "Services", url: "/testnets/tacchain/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/tacchain-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/tacchain-testnet" },
    ],
  },
  {
    imageUrl: "/img/warden-icon.svg",
    title: "Warden",
    chain_id: "barra_9191-1",
    buttons: [
      { label: "Services", url: "/testnets/warden/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/warden-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/warden-testnet" },
    ],
  },
];

const CardTestnet: React.FC = () => {
  return (
    <div className="row g-4">
      {items.map((item) => (
        <div className="col-12 col-md-6 col-lg-4 col-xxl-3 mb-4">
          <Card imageUrl={item.imageUrl} title={item.title} chain_id={item.chain_id} buttons={item.buttons} />
        </div>
      ))}
    </div>
  );
};

export default CardTestnet;
