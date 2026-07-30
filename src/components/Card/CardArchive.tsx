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
 */
const items: Item[] = [
  {
    imageUrl: "/img/mantra-icon.svg",
    title: "Mantra",
    chain_id: "mantra-1",
    networkType: "mainnet",
    // Services only — explorer for these chains will be shut down
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
];

export const archiveItems = items;

const CardArchive: React.FC = () => {
  return (
    <div className="row g-4">
      {items.map((item) => (
        <div
          key={item.title}
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
