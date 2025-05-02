import { verified_token } from "./interfaces";

const verified_tokens: verified_token[] = [
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
  },
  {
    slug_id: 'trtl',
    name: 'The Turtle Syndicate',
    hex: '5452544c',
    description: `
      A portion of the revenue generated through $TRTL is allocated to sea turtle conservation initiatives, including habitat protection and research.
      The Turtle Syndicate have also adopted turtles through charity programs, directly contributing to the cause.
      Furthermore, the project envisions creating a self-sustaining ecosystem where $TRTL is used for purchasing goods and services related to marine life welfare, effectively tying the token's utility to real-world conservation efforts.
    `,
    category: 'Adoption',
    token_details: {
      ticker: 'TRTL',
      policy: '52162581184a457fad70470161179c5766f00237d4b67e0f1df1b4e6',
      fingerprint: 'asset1z8eg3p6gezqqfwqnjpfqsyqrt5uv2z0aejuf0p',
      supply: 356000000000,
      decimals: 0,
    },
    images: {
      logo: "https://pbs.twimg.com/profile_images/1793645283131179008/eb6ZDAKC_400x400.jpg", //token backs collections, image points to founder unless something else wants to be used
      header: "/headers/trtl.jpg"
    },
    links: {
      discord:  "discord.gg/JDBSwuzdvj",
      x: "https://x.com/am__panic", //token backs collections, x points to founder
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
  },
];

export default verified_tokens;