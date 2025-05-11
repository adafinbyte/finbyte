import { thirdparty_logos } from "@/utils/consts";
import { curated_token } from "./interfaces";

const curated_tokens: curated_token[] = [
  {
    slug_id: 'finbyte',
    name: 'Finbyte',
    hex: '',
    description: 'Helping users get engaged with Cardano.',
    category: 'Communications',
    token_details: {
      ticker: 'FIN',
      policy: '',
      fingerprint: '',
      supply: 0,
      decimals: 0,
    },
    images: {
      logo: '/finbyte.png'
    },
    links: {
      discord: '',
      github: '',
      x: '',
    },
  },
  {
    slug_id: 'iagon',
    name: 'Iagon',
    hex: '494147',
    description: `
      IAGON is bridging decentralization with compliance for Web 3.0.
    `,
    category: 'Cloud Services',
    token_details: {
      ticker: 'IAG',
      policy: '5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114',
      fingerprint: 'asset1z62wksuv4sjkl24kjgr2sm8tfr4p0cf9p32rca',
      supply: 1000000000,
      decimals: 6,
    },
    images: {
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11078.png'
    },
    links: {
      discord: "https://discord.gg/TCS23VWuWm",
      telegram: "https://t.me/iagon_official",
      x: "https://x.com/IagonOfficial",
      website: "https://iagon.com/",
    },
    finbyte: {
      collection: [
        {
          title: 'View on TapTools',
          image: thirdparty_logos.taptools,
          url: 'https://www.taptools.io/charts/token/f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.7b12f25ce8d6f424e1edbc8b61f0742fb13252605f31dc40373d6a245e8ec1d1',
          description: 'Explore the top Cardano analytics platform: detailed insights on portfolios, trade history, DeFi, NFTs, and wallets.'
        },
      ],
    },
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
];

export default curated_tokens;