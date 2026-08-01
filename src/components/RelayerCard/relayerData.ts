/**
 * Single source of truth for the Relayers page.
 * Each hub = one relayer wallet + the routes it serves (hub chain -> target chain).
 */

export type RelayerChain = {
  name: string;
  icon: string;
  walletUrl: string;
};

export type RelayerHub = {
  id: string;
  chain: RelayerChain;
  routes: RelayerChain[];
};

const chains: Record<string, RelayerChain> = {
  osmosis: {
    name: "Osmosis",
    icon: "/img/osmosis-icon.svg",
    walletUrl:
      "https://www.mintscan.io/osmosis/address/osmo1238rpkaw44fys2cz27dng69anaugnkweh7954z",
  },
  cosmoshub: {
    name: "CosmosHub",
    icon: "/img/cosmoshub-icon.svg",
    walletUrl:
      "https://explorer.shazoes.xyz/cosmoshub-mainnet/account/cosmos1238rpkaw44fys2cz27dng69anaugnkwel9kyrs",
  },
  noble: {
    name: "Noble",
    icon: "/img/noble-icon.svg",
    walletUrl:
      "https://www.mintscan.io/noble/address/noble1238rpkaw44fys2cz27dng69anaugnkwehxrvm7",
  },
  atomone: {
    name: "Atomone",
    icon: "/img/atomone-icon.svg",
    walletUrl:
      "https://explorer.shazoes.xyz/atomone-mainnet/account/atone1238rpkaw44fys2cz27dng69anaugnkwe392r4g",
  },
  babylon: {
    name: "Babylon",
    icon: "/img/babylon-icon.svg",
    walletUrl:
      "https://www.mintscan.io/babylon/address/bbn1238rpkaw44fys2cz27dng69anaugnkwegm84uf",
  },
  lava: {
    name: "Lava",
    icon: "/img/lava-icon.svg",
    walletUrl:
      "https://explorer.shazoes.xyz/lava-mainnet/account/lava@1238rpkaw44fys2cz27dng69anaugnkwe8appya",
  },
  mantra: {
    name: "Mantra",
    icon: "/img/mantra-icon.svg",
    walletUrl:
      "https://www.mintscan.io/mantra/address/mantra1238rpkaw44fys2cz27dng69anaugnkwe5wuqq2",
  },
  nillion: {
    name: "Nillion",
    icon: "/img/nillion-icon.svg",
    walletUrl:
      "https://www.mintscan.io/nillion/address/nillion1238rpkaw44fys2cz27dng69anaugnkwey9ghgn",
  },
  seda: {
    name: "Seda",
    icon: "/img/seda-icon.svg",
    walletUrl:
      "https://seda.explorers.guru/account/seda1238rpkaw44fys2cz27dng69anaugnkweft6uq3",
  },
  shentu: {
    name: "Shentu",
    icon: "/img/shentu-icon.svg",
    walletUrl:
      "https://explorer.shazoes.xyz/shentu-mainnet/account/shentu1238rpkaw44fys2cz27dng69anaugnkweh3ja3d",
  },
  synternet: {
    name: "Synternet",
    icon: "/img/synternet-icon.svg",
    walletUrl:
      "https://ping.pub/synternet/account/synt1238rpkaw44fys2cz27dng69anaugnkwesz9f8c",
  },
  terra: {
    name: "Terra",
    icon: "/img/terra-icon.svg",
    walletUrl:
      "https://explorer.shazoes.xyz/terra-mainnet/account/terra1238rpkaw44fys2cz27dng69anaugnkweepvyps",
  },
};

const c = chains;

export const relayerHubs: RelayerHub[] = [
  {
    id: "osmosis",
    chain: c.osmosis,
    routes: [
      c.atomone,
      c.babylon,
      c.lava,
      c.mantra,
      c.nillion,
      c.seda,
      c.shentu,
      c.synternet,
      c.terra,
    ],
  },
  {
    id: "cosmoshub",
    chain: c.cosmoshub,
    routes: [c.babylon, c.lava, c.mantra, c.nillion, c.seda, c.terra],
  },
  { id: "noble", chain: c.noble, routes: [c.babylon, c.mantra, c.terra] },
  { id: "atomone", chain: c.atomone, routes: [c.osmosis] },
  {
    id: "babylon",
    chain: c.babylon,
    routes: [c.osmosis, c.cosmoshub, c.noble],
  },
  { id: "lava", chain: c.lava, routes: [c.osmosis, c.cosmoshub] },
  {
    id: "mantra",
    chain: c.mantra,
    routes: [c.osmosis, c.cosmoshub, c.noble],
  },
  { id: "nillion", chain: c.nillion, routes: [c.osmosis, c.cosmoshub] },
  { id: "seda", chain: c.seda, routes: [c.osmosis] },
  { id: "shentu", chain: c.shentu, routes: [c.osmosis] },
  { id: "synternet", chain: c.synternet, routes: [c.osmosis] },
  {
    id: "terra",
    chain: c.terra,
    routes: [c.osmosis, c.cosmoshub, c.noble],
  },
];

export const totalRoutes = relayerHubs.reduce(
  (n, h) => n + h.routes.length,
  0,
);

export const uniqueChainCount = Object.keys(chains).length;
