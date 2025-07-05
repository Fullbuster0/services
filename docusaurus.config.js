// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Shazoes",
  tagline: "Trusted Blockchain Validator",
  favicon: "img/shazoes.ico",

  url: "https://services.shazoes.xyz",
  baseUrl: "/",

  organizationName: "Shazoes",
  projectName: "Shazoes",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          routeBasePath: "yay",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "mainnets",
        path: "mainnets",
        routeBasePath: "mainnets",
        sidebarPath: require.resolve("./sidebarsMainnets.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "testnets",
        path: "testnets",
        routeBasePath: "testnets",
        sidebarPath: require.resolve("./sidebarsTestnets.js"),
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Shazoes",
      logo: {
        alt: "Shazoes Logo",
        src: "img/shazoes.ico",
      },
      items: [
        { to: "/mainnets", position: "left", label: "Mainnets" },
        { to: "/testnets", label: "Testnets", position: "left" },
        { to: "/relayers", label: "Relayers", position: "left" },
        { href: "https://monitor.shazoes.xyz", label: "Monitoring", position: "right" },
        { href: "https://explorer.shazoes.xyz", label: "Explorer", position: "right" },
      ],
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
