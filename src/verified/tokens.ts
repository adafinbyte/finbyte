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
        topics, check NFT rarities, explore tokens, or support projects directly, Finbyte
        puts it all at your fingertips.
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
];

export default curated_tokens;