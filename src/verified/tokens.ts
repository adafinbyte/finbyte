import { thirdparty_logos } from "@/utils/consts";
import { curated_token } from "./interfaces";

const curated_tokens: curated_token[] = [
  {
    slug_id: 'finbyte',
    name: 'Finbyte',
    hex: '7446494e',
    description: `
        Finbyte is a Cardano-native forum platform designed for the crypto-savvy and
        community-minded. Inspired by the simplicity of Reddit, Finbyte goes further by
        offering powerful on-chain tools, token-based engagement, and an open-source
        foundation for transparency and growth. Whether you're looking to discuss crypto
        topics, explore tokens, or support projects directly, Finbyte puts it all at your
        fingertips.
    `,
    category: 'Communications',
    token_details: {
      ticker: 'tFIN',
      policy: '37524129746446a5a55da896fe5379508244ea85e4c140156badbdc6',
      fingerprint: 'asset1cclcn3xtx7fzr7mj4zgj6ek8dpyx3qdzluuujq',
      supply: 1000000000,
      decimals: 4,
    },
    images: {
      logo: '/finbyte.png'
    },
    links: {
      discord: 'https://discord.com/invite/EVawcspwyp',
      github: 'https://github.com/adafinbyte/finbyte',
      x: 'https://x.com/adaFinbyte',
    },
    finbyte: {
      collection: [
        {title: '$tFIN', image: '/finbyte.png', url: 'https://finbyte.network/tFIN', description: 'View details about $tFIN, the testnet token for the Finbyte Network.' },
        {title: '[PreProd] Cardanoscan', image: 'https://strica.io/_nuxt/img/cardanoscan-logo.c8891c5.png', url: 'https://preprod.cardanoscan.io/token/37524129746446a5a55da896fe5379508244ea85e4c140156badbdc67446494e', description: 'Feature rich blockchain explorer and analytics platform for Cardano.'},
        {title: 'Finbyte Network', image: '/finbyte.png', url: 'https://finbyte.network/', description: 'Finbyte, The Future of Social; Built on Cardano. Finbyte is a web3-native community platform tailored for the Cardano ecosystem.' },
      ]
    }
  },
  {
    slug_id: 'snek',
    name: 'Snek',
    hex: '534e454b',
    description: `
      The chillest meme coin on Cardano - In Snek We Trust.
    `,
    category: 'Meme',
    token_details: {
      ticker: 'SNEK',
      policy: '279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f',
      fingerprint: 'asset108xu02ckwrfc8qs9d97mgyh4kn8gdu9w8f5sxk',
      supply: 76715880000,
      decimals: 0,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1753525632791703552/bCT4BKbd_400x400.jpg",
      header: "/headers/snek.jpg"
    },
    links: {
      discord:  "https://discord.com/invite/KB4GdmCNjh",
      telegram: "https://t.me/snekcoinada",
      x: "https://x.com/snek",
      website:  "https://www.snek.com/",
    },
    finbyte: {
      collection: [
        {
          title: 'Snek Energy',
          image: 'https://snek.energy/cdn/shop/files/Product5.jpg?v=1694508666&width=360',
          url: 'https://snek.energy/',
          description: 'Unleash the SNEK within.'
        },
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/snek',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'bodega',
    name: 'Bodega Market',
    hex: '424f44454741',
    description: `
      Discover the Future, Predict with Confidence.
    `,
    category: 'Prediction Market',
    token_details: {
      ticker: 'BODEGA',
      policy: '5deab590a137066fef0e56f06ef1b830f21bc5d544661ba570bdd2ae',
      fingerprint: 'asset1f8paxp0vuytlw37aqpcnufx4uge8y3kakvqqkk',
      supply: 25000000,
      decimals: 6,
    },
    images: {
      logo: "https://avatars.githubusercontent.com/u/181398172?s=200&v=4",
    },
    links: {
      discord: "https://discord.com/invite/GQKzhjaW53",
      github: "https://github.com/bodega-market/bodega-market-smart-contracts",
      x: "https://x.com/bodegacardano",
      website: "https://www.bodegacardano.org/",
    },
    finbyte: {
      collection: [
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/41bb9c6a2f4ab79d918c822fa6ff20cef1cfef9e45a2fb02886e2ec5.424f444547415f4144415f4e4654',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'catsky',
    name: 'Catsky AI',
    hex: '434154534b59',
    description: `
      Catsky AI is what happens when you combine Cat Memes, Artificial Intelligence, and Cardano to building innovative AI enabled tools and services.
    `,
    category: 'AI',
    token_details: {
      ticker: 'CATSKY',
      policy: '9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921',
      fingerprint: 'asset18zpauqujk3cu9cypneh8t7l46wmrwa5klmslnm',
      supply: 999999999997,
      decimals: 0,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1889133863382712320/WfhhLK9T_400x400.jpg",
      header: "https://pbs.twimg.com/profile_banners/1651627976759341056/1689021631/1500x500"
    },
    links: {
      discord:  "https://discord.gg/JTH8WZfnM3",
      x: "https://x.com/Catskycrypto",
      website:  "https://catsky.io/",
    },
    finbyte: {
      collection: [
        {
          title: 'Purfessor Catsky: Your AI Guide to Cardano!',
          image: 'https://chat.catsky.io/_next/image?url=%2Fprofessor.png&w=384&q=75',
          url: 'https://chat.catsky.io/',
          description: 'Purfessor Catsky is an AI-powered learning assistant designed to make understanding the Cardano blockchain easy and engaging. This interactive tool combines advanced AI technology with a user-friendly interface to provide clear, concise explanations tailored to both beginners and advanced users.'
        },
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.b5200ecdc38ecb2e5fb138ecb5ac74f93d95890253126302f1e9c27527798333?rankBy=mcap&order=desc&minLiq=10000&minHolders=100&mcapCustomFilters=true',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'sugr',
    name: 'Sugar Bush',
    hex: '53554741522042555348',
    description: `
      In 2013, Charles Hoskinson had a hair brained idea: enlist Sugar Bush,
      the world's most photographed squirrel, to promote Bitcoin - a move so
      ahead of its time it predated the creation of meme coins.
    `,
    category: 'Meme',
    token_details: {
      ticker: 'SUGR',
      policy: '766fce8055f39d40fcfc19721677b3deb2e7846950ae08dce757f1e7',
      fingerprint: 'asset1dh438qmp3nfse3enec9yl6g92tn4ttzkjsrmmg',
      supply: 1000000000,
      decimals: 0,
    },
    images: {
      logo: 'https://pbs.twimg.com/profile_images/1903811503221837824/b5CDRDPg_400x400.jpg'
    },
    links: {
      discord: "https://discord.gg/sugarbush",
      telegram: "https://t.me/sugarcardano",
      x: "https://x.com/sugr_token",
      website: "https://www.sugarcardano.io/",
    },
    finbyte: {
      collection: [
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.7b12f25ce8d6f424e1edbc8b61f0742fb13252605f31dc40373d6a245e8ec1d1',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
        {
          title: '$SUGR Factory',
          image: 'https://www.sugarcardano.io/factory/assets/arena/nut.png',
          url: 'https://sugarcardano.io/factory/#/',
          description: 'The Sugar Factory is a decentralized application designed to elevate the $SUGR ecosystem by fostering deeper user engagement and promoting the long term holding of $SUGAR tokens.'
        }
      ],
    },
  },
  {
    slug_id: 'starch',
    name: 'Starch',
    hex: '53746172636820546f6b656e',
    description: `
      First minable native token on Cardano. Mine STRCH, to get tokens and support Starch Pool.
    `,
    category: 'Layer 2',
    token_details: {
      ticker: 'STRCH',
      policy: '3d77d63dfa6033be98021417e08e3368cc80e67f8d7afa196aaa0b39',
      fingerprint: 'asset1klefxla6wpfx4a924hctj7s6yc9ypy26n0lzxv',
      supply: 43000000000000,
      decimals: 0,
    },
    images: {
      logo: "https://coin-images.coingecko.com/coins/images/34545/large/STRCHlogo.png?1705340645",
      header: "https://pbs.twimg.com/profile_banners/1893290120499077120/1740230690/1500x500"
    },
    links: {
      discord: "https://discord.com/invite/j2pxQPMF9H",
      x: "https://twitter.com/StratumOakmont",
      website:  "https://starch.one/",
    },
    finbyte: {
      collection: [
        {
          title: 'Mint $STRCH Miner',
          image: 'https://coin-images.coingecko.com/coins/images/34545/large/STRCHlogo.png?1705340645',
          url: 'https://starch.one/mint',
          description: 'Start mining $STRCH today by minting your very own miner.'
        },
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.30a69428cbd214c5b1dd051e3e3a862f9eac76378358736498d1797c69904a01',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'strike',
    name: 'Strike Finance',
    hex: '535452494b45',
    description: `
      The Derivatives Protocol that Cardano Deserves.
      An open-source, user-friendly derivatives protocol.
    `,
    category: 'Derivatives',
    token_details: {
      ticker: 'STRIKE',
      policy: 'f13ac4d66b3ee19a6aa0f2a22298737bd907cc95121662fc971b5275',
      fingerprint: 'asset1tdalpjgjmt2vrhq9fvwzxqgqcq8ydr7e7e0eta',
      supply: 25000000,
      decimals: 6,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1896810403008745472/ln9biDwj_400x400.jpg",
      header: "https://pbs.twimg.com/profile_banners/1796407872877940737/1741025894/1500x500"
    },
    links: {
      discord: "https://discord.com/invite/SjH4NDeEGq",
      x: "https://x.com/strikecardano",
      website: "https://app.strikefinance.org/",
      github: 'https://github.com/orgs/strike-finance/repositories'
    },
    finbyte: {
      collection: [
        {
          title: 'Stake $STRIKE',
          image: 'https://pbs.twimg.com/profile_images/1896810403008745472/ln9biDwj_400x400.jpg',
          url: 'https://beta.strikefinance.org/staking',
          description: 'By staking STRIKE tokens you will be able to earn revenue generated by the platform. 100% of the revenue will be distributed to stakers. Rewards are given out every 3 epoch and you must be staked the entire time to receieve rewards.'
        },
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/strike',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'chad',
    name: 'Charles the Chad',
    hex: '436861726c6573207468652043686164',
    description: `
      Born from the relentless mockery of Charles Hoskinson, Charles the Chad rose as the ultimate avenger.
    `,
    category: 'Meme',
    token_details: {
      ticker: 'CHAD',
      policy: '97075bf380e65f3c63fb733267adbb7d42eec574428a754d2abca55b',
      fingerprint: 'asset1dmqr7kzjw07c4n5c00df0e30nf8l38n4awxwhv',
      supply: 1000000000,
      decimals: 0,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1861339837577523200/bT56HlQH_400x400.jpg",
      header: "https://pbs.twimg.com/profile_banners/1656641036226121732/1732612974/1500x500"
    },
    links: {
      discord: "https://discord.gg/BCpFUz9Xhs",
      x: "https://x.com/charles_thechad",
      website: "https://charlesthechad.com/",
    },
    finbyte: {
      collection: [
        {
          title: 'Chadswap',
          image: 'https://pbs.twimg.com/profile_images/1903026989088509956/-AJ0I9l7_400x400.jpg',
          url: 'https://chadswap.com/',
          description: 'Trade tokens effortlessly with ChadSwap, the most seamless, secure, and intuitive trading experience around.'
        },
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/d8eb52caf3289a2880288b23141ce3d2a7025dcf76f26fd5659add06.7b22d6b425593f22941a8d850a35187051be4acfafa9059ea8a301e6fe42880c',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'nuvola',
    name: 'Nuvola Digital',
    hex: '4e564c',
    description: `
      Nuvola Digital is a DePIN aggregator, allowing access to revenue share models to the public.
    `,
    category: 'DePIN',
    token_details: {
      ticker: 'NVL',
      policy: '5b26e685cc5c9ad630bde3e3cd48c694436671f3d25df53777ca60ef',
      fingerprint: 'asset1jle4pt4cg8264ypx4u45vt99haa6ty3t7naxer',
      supply: 21000000,
      decimals: 6,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1773720958273998849/WFzPqr1I_400x400.jpg",
      header: "https://pbs.twimg.com/profile_banners/1766705384616566784/1711723468/1500x500"
    },
    links: {
      discord: "https://discord.gg/nuvola",
      x: "https://twitter.com/NuvolaDigital",
      website: "https://www.nuvoladigital.io/",
    },
    finbyte: {
      collection: [
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/nvl',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'dux',
    name: 'TheChosenDux',
    hex: '5468652043686f73656e20447578',
    description: `
      A Meme Coin Built on Trust. Created for The People by the People.
    `,
    category: 'Meme',
    token_details: {
      ticker: 'DUX',
      policy: 'f42d942e6d7f9f3adeacd3468df58079867da7c12cfeff784dd68a2b',
      fingerprint: 'asset1uhpfyaw2k9srru063gpllu0lkgqsg0zzazdxgg',
      supply: 1000000000,
      decimals: 0,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1866740044742135808/89au9R_Y_400x400.jpg",
      header: "https://pbs.twimg.com/profile_banners/1866739071508418564/1734122045/1500x500"
    },
    links: {
      discord: "https://discord.gg/2yZ9d6CBru",
      x: "https://x.com/thechosendux",
      website: "https://www.thechosendux.io/",
    },
    finbyte: {
      collection: [
        {
          title: 'DUX Luck Box',
          image: 'https://loot.thechosendux.io/_next/image?url=%2Flogo.png&w=1080&q=75',
          url: 'https://loot.thechosendux.io/',
          description: 'Get 1 Baby DUX NFT & win up to $400 in tokens! Price: 8 ADA or 39,999 $DUX'
        },
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/d8eb52caf3289a2880288b23141ce3d2a7025dcf76f26fd5659add06.aa4b7bd7c946eb9d9bb0286e3f6c2087f3ce4525cc538214e463b6bb2c97bb7e?rankBy=mcap&order=desc&assetType=Tokens&minLiq=10000&minHolders=100&mcapCustomFilters=true&page=3',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
  {
    slug_id: 'palm',
    name: 'Palm Economy Token',
    hex: '50414c4d0a',
    description: `
      The PALM Economy is a leading real-world asset (RWA) Commodities
      Trade-DeFi project. The $PALM utility token is the lifeblood of
      the Palmyra ecosystem, which utilizes RWA tokenization, decentralized
      trade financing, on-chain traceability, and credentials. The project
      addresses a multi-trillion-dollar gap in commodities market access
      and trade financing all around the world. With a focus on emerging
      markets, the team has already deployed solutions across Sri Lanka,
      Nepal, Indonesia, Japan, Argentina, Paraguay, Greece, and East
      Africa, leveraging tokenized RWAs to offer unparalleled transparency,
      efficiency, and global market access.
    `,
    category: 'RWA',
    token_details: {
      ticker: 'PALM',
      policy: 'b7c5cd554f3e83c8aa0900a0c9053284a5348244d23d0406c28eaf4d',
      fingerprint: 'asset1rac2h0ch8jkfzhqk5rjfejkcaa6mrhp8ecaz34',
      supply: 50000000000,
      decimals: 6,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1821185843102412800/P23JRaEw_400x400.jpg",
      header: "https://pbs.twimg.com/profile_banners/1720116218122936320/1710239185/1500x500"
    },
    links: {
      discord: "http://discord.gg/FQRA8wqRWa",
      github: "https://github.com/zenGate-Global",
      telegram: "https://t.me/+iPZFVAjiCUYzMGZh",
      x: "https://x.com/palmeconomy",
      website: "https://palmeconomy.io/",
    },
    finbyte: {
      collection: [
        {
          title: 'Palm Staking Portal',
          image: 'https://pbs.twimg.com/profile_images/1821185843102412800/P23JRaEw_400x400.jpg',
          url: 'https://portal.palmeconomy.io/',
          description: 'Get 1 Baby DUX NFT & win up to $400 in tokens! Price: 8 ADA or 39,999 $DUX'
        },
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.affbf013002dc54470405e4029e8baca9864d8848a313fa03c06643a8db416b6?rankBy=mcap&order=desc&assetType=Tokens&minLiq=10000&minHolders=100&mcapCustomFilters=true&page=3/charts/token/f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.affbf013002dc54470405e4029e8baca9864d8848a313fa03c06643a8db416b6',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
  },
];

export default curated_tokens;