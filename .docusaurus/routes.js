import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/relayers',
    component: ComponentCreator('/relayers', 'd81'),
    exact: true
  },
  {
    path: '/mainnets',
    component: ComponentCreator('/mainnets', 'f23'),
    routes: [
      {
        path: '/mainnets',
        component: ComponentCreator('/mainnets', 'dfb'),
        routes: [
          {
            path: '/mainnets',
            component: ComponentCreator('/mainnets', '7f6'),
            routes: [
              {
                path: '/mainnets/',
                component: ComponentCreator('/mainnets/', 'e22'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/atomone/',
                component: ComponentCreator('/mainnets/atomone/', '8c8'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/atomone/node-installation',
                component: ComponentCreator('/mainnets/atomone/node-installation', '0b6'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/atomone/sync',
                component: ComponentCreator('/mainnets/atomone/sync', 'c30'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/atomone/upgrade',
                component: ComponentCreator('/mainnets/atomone/upgrade', 'd7d'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/atomone/useful-commands',
                component: ComponentCreator('/mainnets/atomone/useful-commands', 'b2b'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/axone/',
                component: ComponentCreator('/mainnets/axone/', '7c9'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/axone/node-installation',
                component: ComponentCreator('/mainnets/axone/node-installation', '007'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/axone/sync',
                component: ComponentCreator('/mainnets/axone/sync', 'f9f'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/axone/upgrade',
                component: ComponentCreator('/mainnets/axone/upgrade', 'e51'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/axone/useful-commands',
                component: ComponentCreator('/mainnets/axone/useful-commands', '230'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/babylon/',
                component: ComponentCreator('/mainnets/babylon/', 'f2a'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/babylon/node-installation',
                component: ComponentCreator('/mainnets/babylon/node-installation', '9dc'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/babylon/sync',
                component: ComponentCreator('/mainnets/babylon/sync', '493'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/babylon/upgrade',
                component: ComponentCreator('/mainnets/babylon/upgrade', '899'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/babylon/useful-commands',
                component: ComponentCreator('/mainnets/babylon/useful-commands', '01b'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/dhealth/',
                component: ComponentCreator('/mainnets/dhealth/', 'b65'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/dhealth/node-installation',
                component: ComponentCreator('/mainnets/dhealth/node-installation', '58c'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/dhealth/sync',
                component: ComponentCreator('/mainnets/dhealth/sync', '1c5'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/dhealth/upgrade',
                component: ComponentCreator('/mainnets/dhealth/upgrade', 'ca0'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/dhealth/useful-commands',
                component: ComponentCreator('/mainnets/dhealth/useful-commands', '5c1'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/fuel/',
                component: ComponentCreator('/mainnets/fuel/', '2fd'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/fuel/node-installation',
                component: ComponentCreator('/mainnets/fuel/node-installation', '641'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/fuel/sync',
                component: ComponentCreator('/mainnets/fuel/sync', 'c72'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/fuel/upgrade',
                component: ComponentCreator('/mainnets/fuel/upgrade', '249'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/fuel/useful-commands',
                component: ComponentCreator('/mainnets/fuel/useful-commands', '8e4'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/hippo/',
                component: ComponentCreator('/mainnets/hippo/', 'b85'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/hippo/node-installation',
                component: ComponentCreator('/mainnets/hippo/node-installation', '23c'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/hippo/sync',
                component: ComponentCreator('/mainnets/hippo/sync', 'c4f'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/hippo/upgrade',
                component: ComponentCreator('/mainnets/hippo/upgrade', 'b6d'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/hippo/useful-commands',
                component: ComponentCreator('/mainnets/hippo/useful-commands', '8af'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lava/',
                component: ComponentCreator('/mainnets/lava/', '835'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lava/node-installation',
                component: ComponentCreator('/mainnets/lava/node-installation', 'd76'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lava/sync',
                component: ComponentCreator('/mainnets/lava/sync', 'b90'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lava/upgrade',
                component: ComponentCreator('/mainnets/lava/upgrade', '3a4'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lava/useful-commands',
                component: ComponentCreator('/mainnets/lava/useful-commands', '15a'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lumera/',
                component: ComponentCreator('/mainnets/lumera/', '5a8'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lumera/node-installation',
                component: ComponentCreator('/mainnets/lumera/node-installation', 'bef'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lumera/sync',
                component: ComponentCreator('/mainnets/lumera/sync', '69a'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lumera/upgrade',
                component: ComponentCreator('/mainnets/lumera/upgrade', '7e6'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/lumera/useful-commands',
                component: ComponentCreator('/mainnets/lumera/useful-commands', '2fa'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/mantra/',
                component: ComponentCreator('/mainnets/mantra/', '3d8'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/mantra/node-installation',
                component: ComponentCreator('/mainnets/mantra/node-installation', '6c2'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/mantra/sync',
                component: ComponentCreator('/mainnets/mantra/sync', 'b8d'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/mantra/upgrade',
                component: ComponentCreator('/mainnets/mantra/upgrade', 'bf0'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/mantra/useful-commands',
                component: ComponentCreator('/mainnets/mantra/useful-commands', '665'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/nillion/',
                component: ComponentCreator('/mainnets/nillion/', '8ab'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/nillion/node-installation',
                component: ComponentCreator('/mainnets/nillion/node-installation', 'c10'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/nillion/sync',
                component: ComponentCreator('/mainnets/nillion/sync', 'cad'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/nillion/upgrade',
                component: ComponentCreator('/mainnets/nillion/upgrade', 'e7f'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/nillion/useful-commands',
                component: ComponentCreator('/mainnets/nillion/useful-commands', '4c9'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/provenance/',
                component: ComponentCreator('/mainnets/provenance/', '4f4'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/provenance/node-installation',
                component: ComponentCreator('/mainnets/provenance/node-installation', '6c7'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/provenance/sync',
                component: ComponentCreator('/mainnets/provenance/sync', '90f'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/provenance/upgrade',
                component: ComponentCreator('/mainnets/provenance/upgrade', '7c0'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/provenance/useful-commands',
                component: ComponentCreator('/mainnets/provenance/useful-commands', '728'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/regen/',
                component: ComponentCreator('/mainnets/regen/', '88f'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/regen/node-installation',
                component: ComponentCreator('/mainnets/regen/node-installation', 'e67'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/regen/sync',
                component: ComponentCreator('/mainnets/regen/sync', 'aed'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/regen/upgrade',
                component: ComponentCreator('/mainnets/regen/upgrade', '825'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/regen/useful-commands',
                component: ComponentCreator('/mainnets/regen/useful-commands', '52f'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/seda/',
                component: ComponentCreator('/mainnets/seda/', 'dc3'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/seda/node-installation',
                component: ComponentCreator('/mainnets/seda/node-installation', 'f22'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/seda/sync',
                component: ComponentCreator('/mainnets/seda/sync', '3df'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/seda/upgrade',
                component: ComponentCreator('/mainnets/seda/upgrade', '0cb'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/seda/useful-commands',
                component: ComponentCreator('/mainnets/seda/useful-commands', '995'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/selfchain/',
                component: ComponentCreator('/mainnets/selfchain/', '2c2'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/selfchain/node-installation',
                component: ComponentCreator('/mainnets/selfchain/node-installation', 'b4c'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/selfchain/sync',
                component: ComponentCreator('/mainnets/selfchain/sync', 'f82'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/selfchain/upgrade',
                component: ComponentCreator('/mainnets/selfchain/upgrade', '4f3'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/selfchain/useful-commands',
                component: ComponentCreator('/mainnets/selfchain/useful-commands', 'e46'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/shentu/',
                component: ComponentCreator('/mainnets/shentu/', '3ca'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/shentu/node-installation',
                component: ComponentCreator('/mainnets/shentu/node-installation', 'e14'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/shentu/sync',
                component: ComponentCreator('/mainnets/shentu/sync', '6f9'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/shentu/upgrade',
                component: ComponentCreator('/mainnets/shentu/upgrade', 'fbe'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/shentu/useful-commands',
                component: ComponentCreator('/mainnets/shentu/useful-commands', 'f24'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/synternet/',
                component: ComponentCreator('/mainnets/synternet/', '40d'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/synternet/node-installation',
                component: ComponentCreator('/mainnets/synternet/node-installation', '61c'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/synternet/sync',
                component: ComponentCreator('/mainnets/synternet/sync', 'c14'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/synternet/upgrade',
                component: ComponentCreator('/mainnets/synternet/upgrade', 'e89'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/synternet/useful-commands',
                component: ComponentCreator('/mainnets/synternet/useful-commands', '7b3'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/tellor/',
                component: ComponentCreator('/mainnets/tellor/', '2be'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/tellor/node-installation',
                component: ComponentCreator('/mainnets/tellor/node-installation', 'aeb'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/tellor/sync',
                component: ComponentCreator('/mainnets/tellor/sync', '68f'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/tellor/upgrade',
                component: ComponentCreator('/mainnets/tellor/upgrade', 'e41'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/tellor/useful-commands',
                component: ComponentCreator('/mainnets/tellor/useful-commands', '4cc'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/terra/',
                component: ComponentCreator('/mainnets/terra/', '2d9'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/terra/node-installation',
                component: ComponentCreator('/mainnets/terra/node-installation', 'eac'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/terra/sync',
                component: ComponentCreator('/mainnets/terra/sync', '267'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/terra/upgrade',
                component: ComponentCreator('/mainnets/terra/upgrade', 'dda'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/terra/useful-commands',
                component: ComponentCreator('/mainnets/terra/useful-commands', 'f6e'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/union/',
                component: ComponentCreator('/mainnets/union/', 'bf7'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/union/node-installation',
                component: ComponentCreator('/mainnets/union/node-installation', '750'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/union/sync',
                component: ComponentCreator('/mainnets/union/sync', '7ba'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/union/upgrade',
                component: ComponentCreator('/mainnets/union/upgrade', 'e06'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/union/useful-commands',
                component: ComponentCreator('/mainnets/union/useful-commands', '404'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/zetachain/',
                component: ComponentCreator('/mainnets/zetachain/', '7e9'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/zetachain/node-installation',
                component: ComponentCreator('/mainnets/zetachain/node-installation', '1d6'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/zetachain/sync',
                component: ComponentCreator('/mainnets/zetachain/sync', '042'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/zetachain/upgrade',
                component: ComponentCreator('/mainnets/zetachain/upgrade', 'f27'),
                exact: true,
                sidebar: "mainnetsSidebars"
              },
              {
                path: '/mainnets/zetachain/useful-commands',
                component: ComponentCreator('/mainnets/zetachain/useful-commands', '70c'),
                exact: true,
                sidebar: "mainnetsSidebars"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/testnets',
    component: ComponentCreator('/testnets', '5d3'),
    routes: [
      {
        path: '/testnets',
        component: ComponentCreator('/testnets', 'e02'),
        routes: [
          {
            path: '/testnets',
            component: ComponentCreator('/testnets', 'a34'),
            routes: [
              {
                path: '/testnets/',
                component: ComponentCreator('/testnets/', '561'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/airchain/',
                component: ComponentCreator('/testnets/airchain/', '700'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/airchain/node-installation',
                component: ComponentCreator('/testnets/airchain/node-installation', 'be4'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/airchain/sync',
                component: ComponentCreator('/testnets/airchain/sync', 'de3'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/airchain/upgrade',
                component: ComponentCreator('/testnets/airchain/upgrade', '8a9'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/airchain/useful-commands',
                component: ComponentCreator('/testnets/airchain/useful-commands', '43c'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/atomone/',
                component: ComponentCreator('/testnets/atomone/', '91d'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/atomone/node-installation',
                component: ComponentCreator('/testnets/atomone/node-installation', '6d0'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/atomone/sync',
                component: ComponentCreator('/testnets/atomone/sync', 'be5'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/atomone/upgrade',
                component: ComponentCreator('/testnets/atomone/upgrade', '4cc'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/atomone/useful-commands',
                component: ComponentCreator('/testnets/atomone/useful-commands', 'f7f'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/axone/',
                component: ComponentCreator('/testnets/axone/', '655'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/axone/node-installation',
                component: ComponentCreator('/testnets/axone/node-installation', 'f95'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/axone/sync',
                component: ComponentCreator('/testnets/axone/sync', '51d'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/axone/upgrade',
                component: ComponentCreator('/testnets/axone/upgrade', '68b'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/axone/useful-commands',
                component: ComponentCreator('/testnets/axone/useful-commands', 'c82'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/cardchain/',
                component: ComponentCreator('/testnets/cardchain/', 'ca2'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/cardchain/node-installation',
                component: ComponentCreator('/testnets/cardchain/node-installation', 'cb2'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/cardchain/sync',
                component: ComponentCreator('/testnets/cardchain/sync', '425'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/cardchain/upgrade',
                component: ComponentCreator('/testnets/cardchain/upgrade', 'e70'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/cardchain/useful-commands',
                component: ComponentCreator('/testnets/cardchain/useful-commands', '54f'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/empeiria/',
                component: ComponentCreator('/testnets/empeiria/', 'b51'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/empeiria/node-installation',
                component: ComponentCreator('/testnets/empeiria/node-installation', '758'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/empeiria/sync',
                component: ComponentCreator('/testnets/empeiria/sync', 'd3b'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/empeiria/upgrade',
                component: ComponentCreator('/testnets/empeiria/upgrade', '5e9'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/empeiria/useful-commands',
                component: ComponentCreator('/testnets/empeiria/useful-commands', '10b'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/fuel/',
                component: ComponentCreator('/testnets/fuel/', '56a'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/fuel/node-installation',
                component: ComponentCreator('/testnets/fuel/node-installation', '52a'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/fuel/sync',
                component: ComponentCreator('/testnets/fuel/sync', '180'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/fuel/upgrade',
                component: ComponentCreator('/testnets/fuel/upgrade', '65e'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/fuel/useful-commands',
                component: ComponentCreator('/testnets/fuel/useful-commands', 'b1e'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/galactica/',
                component: ComponentCreator('/testnets/galactica/', 'd2c'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/galactica/node-installation',
                component: ComponentCreator('/testnets/galactica/node-installation', 'c26'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/galactica/sync',
                component: ComponentCreator('/testnets/galactica/sync', 'dda'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/galactica/upgrade',
                component: ComponentCreator('/testnets/galactica/upgrade', 'bac'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/galactica/useful-commands',
                component: ComponentCreator('/testnets/galactica/useful-commands', '468'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/gnoland/',
                component: ComponentCreator('/testnets/gnoland/', '18b'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/gnoland/node-installation',
                component: ComponentCreator('/testnets/gnoland/node-installation', '4b0'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/gnoland/sync',
                component: ComponentCreator('/testnets/gnoland/sync', 'c74'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/gnoland/upgrade',
                component: ComponentCreator('/testnets/gnoland/upgrade', '3d3'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/gnoland/useful-commands',
                component: ComponentCreator('/testnets/gnoland/useful-commands', '2e3'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/hippo/',
                component: ComponentCreator('/testnets/hippo/', '925'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/hippo/node-installation',
                component: ComponentCreator('/testnets/hippo/node-installation', 'ac9'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/hippo/sync',
                component: ComponentCreator('/testnets/hippo/sync', 'bdf'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/hippo/upgrade',
                component: ComponentCreator('/testnets/hippo/upgrade', '2a4'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/hippo/useful-commands',
                component: ComponentCreator('/testnets/hippo/useful-commands', 'b45'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/lumera/',
                component: ComponentCreator('/testnets/lumera/', 'd7c'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/lumera/node-installation',
                component: ComponentCreator('/testnets/lumera/node-installation', 'a17'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/lumera/sync',
                component: ComponentCreator('/testnets/lumera/sync', '1d6'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/lumera/upgrade',
                component: ComponentCreator('/testnets/lumera/upgrade', '06b'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/lumera/useful-commands',
                component: ComponentCreator('/testnets/lumera/useful-commands', 'bd8'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/push/',
                component: ComponentCreator('/testnets/push/', '58b'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/push/node-installation',
                component: ComponentCreator('/testnets/push/node-installation', '403'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/push/sync',
                component: ComponentCreator('/testnets/push/sync', 'f9e'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/push/upgrade',
                component: ComponentCreator('/testnets/push/upgrade', 'd70'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/push/useful-commands',
                component: ComponentCreator('/testnets/push/useful-commands', '8db'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/seda/',
                component: ComponentCreator('/testnets/seda/', '291'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/seda/node-installation',
                component: ComponentCreator('/testnets/seda/node-installation', '83f'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/seda/sync',
                component: ComponentCreator('/testnets/seda/sync', '5aa'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/seda/upgrade',
                component: ComponentCreator('/testnets/seda/upgrade', '618'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/seda/useful-commands',
                component: ComponentCreator('/testnets/seda/useful-commands', 'c42'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/soarchain/',
                component: ComponentCreator('/testnets/soarchain/', '896'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/soarchain/node-installation',
                component: ComponentCreator('/testnets/soarchain/node-installation', '696'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/soarchain/sync',
                component: ComponentCreator('/testnets/soarchain/sync', '2a5'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/soarchain/upgrade',
                component: ComponentCreator('/testnets/soarchain/upgrade', '1f6'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/soarchain/useful-commands',
                component: ComponentCreator('/testnets/soarchain/useful-commands', 'dc6'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/story/',
                component: ComponentCreator('/testnets/story/', '00f'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/story/node-installation',
                component: ComponentCreator('/testnets/story/node-installation', 'bf0'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/story/sync',
                component: ComponentCreator('/testnets/story/sync', '046'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/story/upgrade',
                component: ComponentCreator('/testnets/story/upgrade', '6a5'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/story/useful-commands',
                component: ComponentCreator('/testnets/story/useful-commands', '2b8'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/structs/',
                component: ComponentCreator('/testnets/structs/', 'a53'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/structs/node-installation',
                component: ComponentCreator('/testnets/structs/node-installation', '3a3'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/structs/sync',
                component: ComponentCreator('/testnets/structs/sync', '0b0'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/structs/upgrade',
                component: ComponentCreator('/testnets/structs/upgrade', '45e'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/structs/useful-commands',
                component: ComponentCreator('/testnets/structs/useful-commands', '6b1'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/symphony/',
                component: ComponentCreator('/testnets/symphony/', 'a87'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/symphony/node-installation',
                component: ComponentCreator('/testnets/symphony/node-installation', 'c14'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/symphony/sync',
                component: ComponentCreator('/testnets/symphony/sync', '45c'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/symphony/upgrade',
                component: ComponentCreator('/testnets/symphony/upgrade', '418'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/symphony/useful-commands',
                component: ComponentCreator('/testnets/symphony/useful-commands', '175'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/tacchain/',
                component: ComponentCreator('/testnets/tacchain/', '3d2'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/tacchain/node-installation',
                component: ComponentCreator('/testnets/tacchain/node-installation', '04c'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/tacchain/sync',
                component: ComponentCreator('/testnets/tacchain/sync', '134'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/tacchain/upgrade',
                component: ComponentCreator('/testnets/tacchain/upgrade', '688'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/tacchain/useful-commands',
                component: ComponentCreator('/testnets/tacchain/useful-commands', '88a'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/warden/',
                component: ComponentCreator('/testnets/warden/', 'fd1'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/warden/node-installation',
                component: ComponentCreator('/testnets/warden/node-installation', '9b8'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/warden/sync',
                component: ComponentCreator('/testnets/warden/sync', '5d5'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/warden/upgrade',
                component: ComponentCreator('/testnets/warden/upgrade', 'd75'),
                exact: true,
                sidebar: "testnetsSidebars"
              },
              {
                path: '/testnets/warden/useful-commands',
                component: ComponentCreator('/testnets/warden/useful-commands', '3ed'),
                exact: true,
                sidebar: "testnetsSidebars"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/yay',
    component: ComponentCreator('/yay', '6de'),
    routes: [
      {
        path: '/yay',
        component: ComponentCreator('/yay', '1c2'),
        routes: [
          {
            path: '/yay',
            component: ComponentCreator('/yay', '90a'),
            routes: [
              {
                path: '/yay/testo',
                component: ComponentCreator('/yay/testo', '9a8'),
                exact: true,
                sidebar: "docSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
