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
    finbyte: {
      curators: ["jjd3v"],
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
      curators: ["jjd3v"],
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
      curators: ["jjd3v"],
    },
  },
];

export default verified_tokens;