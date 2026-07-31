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

/** Active mainnets we still validate (UI list only). */
const items: Item[] = [
  {
    imageUrl: "/img/atomone-icon.svg",
    title: "Atomone",
    chain_id: "atomone-1",
    buttons: [
      { label: "Services", url: "/mainnets/atomone/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/atomone-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/atomone-mainnet/staking/atonevaloper17f2sq92lqjxwztemmy0aeave07xqg4qtdtp73l",
      },
    ],
  },
  {
    imageUrl: "/img/axone-icon.svg",
    title: "Axone",
    chain_id: "axone-1",
    buttons: [
      { label: "Services", url: "/mainnets/axone/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/axone-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/axone-mainnet/staking/axonevaloper1gf6gnfxqx0jkv86wft5zll7u5vp5ykf7uy5qwn",
      },
    ],
  },
  {
    imageUrl: "/img/cosmoshub-icon.svg",
    title: "CosmosHub",
    chain_id: "cosmoshub-4",
    buttons: [
      { label: "Services", url: "/mainnets/cosmoshub/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/cosmoshub-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/cosmoshub-mainnet/staking/cosmosvaloper19fs9dam0cghptddw5ddc2xysqj3dp7px3hh6af",
      },
    ],
  },
  {
    imageUrl: "/img/hippo-icon.svg",
    title: "Hippo Protocol",
    chain_id: "hippo-protocol-1",
    buttons: [
      { label: "Services", url: "/mainnets/hippo/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/hippo-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/hippo-mainnet/staking/hippovaloper16rl9wdjrgf7lvv89v4r4fnx26kjev0wffyvlqe",
      },
    ],
  },
  {
    imageUrl: "/img/lava-icon.svg",
    title: "Lava",
    chain_id: "lava-mainnet-1",
    buttons: [
      { label: "Services", url: "/mainnets/lava/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/lava-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/lava-mainnet/staking/lava@valoper1m9en2fldt04z6cvup8u8gxxp56f3la9z5j0t6u",
      },
    ],
  },
  {
    imageUrl: "/img/shentu-icon.svg",
    title: "Shentu",
    chain_id: "shentu-2.2",
    buttons: [
      { label: "Services", url: "/mainnets/shentu/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/shentu-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/shentu-mainnet/staking/shentuvaloper1jrnns3nkkrzu7qn5xel088488jv6jmuafm2vdh",
      },
    ],
  },
  {
    imageUrl: "/img/terra-icon.svg",
    title: "Terra",
    chain_id: "phoenix-1",
    buttons: [
      { label: "Services", url: "/mainnets/terra/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/terra-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/terra-mainnet/staking/terravaloper17ux88604vmzcfduv8eul462snp74u4265sjtyz",
      },
    ],
  },
  {
    imageUrl: "/img/zetachain-icon.svg",
    title: "Zetachain",
    chain_id: "zetachain_7000-1",
    buttons: [
      { label: "Services", url: "/mainnets/zetachain/" },
      { label: "Explorer", url: "https://explorer.shazoes.xyz/zetachain-mainnet" },
      {
        label: "Delegate",
        url: "https://explorer.shazoes.xyz/zetachain-mainnet/staking/zetavaloper1n4mzgdztfd742geyuqpgfpy7atu8gc9vl3upgd",
      },
    ],
  },
];

export const mainnetItems = items;

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

const CardMainnet: React.FC<Props> = ({ filterQuery = "" }) => {
  const filtered = items.filter((item) => matchesQuery(item, filterQuery));
  if (filtered.length === 0) {
    return (
      <p className="chainSearchEmpty" role="status">
        No mainnet matches “{filterQuery.trim()}”.
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

export default CardMainnet;
