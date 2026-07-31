import Card from "./Card";

type Button = {
  label: string;
  url: string;
};

type Item = {
  imageUrl: string;
  title: string;
  chain_id?: string;
  /** Origin network type for badge (folder/docs unchanged) */
  networkType: "mainnet" | "testnet";
  buttons: Button[];
};

/**
 * Chains we no longer actively validate.
 * Docs paths stay under /mainnets|/testnets — UI-only Archive tab.
 * Services only (no Explorer — explorer for these will be shut down).
 */
const items: Item[] = [
  // —— former mainnets ——
  {
    imageUrl: "/img/babylon-icon.svg",
    title: "Babylon",
    chain_id: "bbn-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/babylon/" }],
  },
  {
    imageUrl: "/img/fuel-icon.svg",
    title: "Fuel",
    chain_id: "seq-mainnet-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/fuel/" }],
  },
  {
    imageUrl: "/img/lumera-icon.svg",
    title: "Lumera",
    chain_id: "lumera-mainnet-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/lumera/" }],
  },
  {
    imageUrl: "/img/mantra-icon.svg",
    title: "Mantra",
    chain_id: "mantra-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/mantra/" }],
  },
  {
    imageUrl: "/img/nillion-icon.svg",
    title: "Nillion",
    chain_id: "nillion-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/nillion/" }],
  },
  {
    imageUrl: "/img/provenance-icon.svg",
    title: "Provenance",
    chain_id: "pio-mainnet-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/provenance/" }],
  },
  {
    imageUrl: "/img/seda-icon.svg",
    title: "Seda",
    chain_id: "seda-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/seda/" }],
  },
  {
    imageUrl: "/img/synternet-icon.svg",
    title: "Synternet",
    chain_id: "synternet-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/synternet/" }],
  },
  {
    imageUrl: "/img/tellor-icon.svg",
    title: "Tellor",
    chain_id: "tellor-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/tellor/" }],
  },
  {
    imageUrl: "/img/union-icon.svg",
    title: "Union",
    chain_id: "union-1",
    networkType: "mainnet",
    buttons: [{ label: "Services", url: "/mainnets/union/" }],
  },
  // —— former testnets ——
  {
    imageUrl: "/img/airchain-icon.svg",
    title: "Airchain",
    chain_id: "varanasi-1",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/airchain/" }],
  },
  {
    imageUrl: "/img/axone-icon.svg",
    title: "Axone",
    chain_id: "axone-dentrite-1",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/axone/" }],
  },
  {
    imageUrl: "/img/cardchain.png",
    title: "Cardchain",
    chain_id: "cardtestnet-12",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/cardchain/" }],
  },
  {
    imageUrl: "/img/empeiria-icon.svg",
    title: "Empeiria",
    chain_id: "empe-testnet-2",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/empeiria/" }],
  },
  {
    imageUrl: "/img/fuel-icon.svg",
    title: "Fuel",
    chain_id: "seq-testnet-2",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/fuel/" }],
  },
  {
    imageUrl: "/img/lumera-icon.svg",
    title: "Lumera",
    chain_id: "lumera-testnet-2",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/lumera/" }],
  },
  {
    imageUrl: "/img/pushchain-icon.svg",
    title: "Push",
    chain_id: "push_42101-1",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/push/" }],
  },
  {
    imageUrl: "/img/seda-icon.svg",
    title: "Seda",
    chain_id: "seda-1-testnet",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/seda/" }],
  },
  {
    imageUrl: "/img/story-icon.svg",
    title: "Story",
    chain_id: "aeneid",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/story/" }],
  },
  {
    imageUrl: "/img/structs-icon.svg",
    title: "Structs",
    chain_id: "structstestnet-101",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/structs/" }],
  },
  {
    imageUrl: "/img/symphony-icon.svg",
    title: "Symphony",
    chain_id: "symphony-1",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/symphony/" }],
  },
  {
    imageUrl: "/img/tacchain-icon.svg",
    title: "Tacchain",
    chain_id: "tacchain_2391-1",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/tacchain/" }],
  },
  {
    imageUrl: "/img/warden-icon.svg",
    title: "Warden",
    chain_id: "barra_9191-1",
    networkType: "testnet",
    buttons: [{ label: "Services", url: "/testnets/warden/" }],
  },
];

export const archiveItems = items;

const CardArchive: React.FC = () => {
  return (
    <div className="row g-4">
      {items.map((item) => (
        <div
          key={`${item.networkType}-${item.title}-${item.chain_id ?? item.title}`}
          className="col-12 col-md-6 col-lg-4 col-xxl-3 mb-4"
        >
          <Card
            imageUrl={item.imageUrl}
            title={item.title}
            chain_id={item.chain_id}
            buttons={item.buttons}
            networkType={item.networkType}
            archived
          />
        </div>
      ))}
    </div>
  );
};

export default CardArchive;
