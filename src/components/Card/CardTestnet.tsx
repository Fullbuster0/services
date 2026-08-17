import Card from "./Card";

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

/** Active testnets we still validate (UI list only). */
const items: Item[] = [
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
    imageUrl: "/img/gnoland-icon.svg",
    title: "Gnoland",
    chain_id: "sapphire-1",
    buttons: [
      { label: "Services", url: "/testnets/gnoland/" },
      { label: "Explorer", url: "https://gnoscan.io" },
      { label: "Delegate", url: "https://gnoscan.io" },
    ],
  },
  {
    imageUrl: "/img/hippo-icon.svg",
    title: "Hippo Protocol",
    chain_id: "hippo-protocol-testnet-1",
    buttons: [
      { label: "Services", url: "/testnets/hippo/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/hippo-testnet" },
      { label: "Delegate", url: "https://explorer.shazoes.xyz/hippo-testnet" },
    ],
  },
];

export const testnetItems = items;

function matchesQuery(
  item: { title: string; chain_id?: string },
  q: string,
): boolean {
  if (!q) return true;
  const s = q.toLowerCase().trim();
  return (
    item.title.toLowerCase().includes(s) ||
    (item.chain_id ? item.chain_id.toLowerCase().includes(s) : false)
  );
}

type Props = { filterQuery?: string };

const CardTestnet: React.FC<Props> = ({ filterQuery = "" }) => {
  const filtered = items.filter((item) => matchesQuery(item, filterQuery));
  if (filtered.length === 0) {
    return (
      <p className="chainSearchEmpty" role="status">
        No testnet matches “{filterQuery.trim()}”.
      </p>
    );
  }
  return (
    <div className="row g-4">
      {filtered.map((item) => (
        <div
          key={item.title}
          className="col-12 col-md-6 col-lg-4 col-xxl-3 mb-4"
        >
          <Card
            imageUrl={item.imageUrl}
            title={item.title}
            chain_id={item.chain_id}
            buttons={item.buttons}
          />
        </div>
      ))}
    </div>
  );
};

export default CardTestnet;
