import { curated_nft } from "./interfaces";

/**
 * @note
 * - some nfts have support because their collectionName doesn't appear within some endpoints
 * - adahandle support for rarity check is broken as endpoints don't provide the right data (limited or just wrong)
 */

const curated_nfts: curated_nft[] = [
  {
    slug_id: 'dux',
    collection_name: 'TheBabyDux',
    description: 'A Meme coin built on trust, Created for the people by the people.',
    category: 'Meme',
    policy: 'de53e935d272dd079f3e785ee0f3aa21db5579d5399a3b5d0ce3485c',
    images: {
      logo: 'https://pfp.jpgstoreapis.com/de53e935d272dd079f3e785ee0f3aa21db5579d5399a3b5d0ce3485c-hero',
    },
    links: {
      discord: 'https://discord.gg/2yZ9d6CBru',
      website: 'https://thechosendux.io/',
      x: 'https://x.com/thechosendux',
    },
  },
  {
    slug_id: 'adahandle',
    collection_name: 'ADA Handle',
    description: '',
    category: '',
    policy: 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',

    images: {
      logo: 'https://pfp.jpgstoreapis.com/f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a-hero',
    },
    links: {
      discord: 'https://discord.gg/nwbZxANayw',
      website: 'https://adahandle.com/',
      x: 'https://twitter.com/adahandle',
    },
  },
];

export default curated_nfts;