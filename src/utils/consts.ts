

export const cardano = {
  logo:        'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png',
  atomic_unit: 1000000,
};

interface ecosystem_item {title: string; url: string; logo: string;}
/** @note lists all the integrations used by Finbyte */
export const using_third_party: ecosystem_item[] = [
  {title: 'TapTools', url: 'https://taptools.io/', logo: 'https://www.taptools.io/_next/image?url=https%3A%2F%2Ftaptools-public.s3.amazonaws.com%2Fimages%2FTtLogo2.png&w=640&q=75'},
  {title: 'MeshJS', url: 'https://meshjs.dev/', logo: 'https://meshjs.dev/logo-mesh/white/logo-mesh-white-64x64.png'},
  {title: 'DexHunter', url: 'https://www.dexhunter.io/', logo: 'https://www.dexhunter.io/_next/static/media/hunt-token.0f202821.svg'},
  {title: 'PoolPM', url: 'https://pool.pm/', logo: 'https://pool.pm/pool.pm.svg'},
  {title: 'Blockfrost', url: 'https://blockfrost.io/', logo: 'https://pbs.twimg.com/profile_images/1683911708719316992/n9LpcKJk_400x400.png'},
  {title: 'ADA Handle', url: 'https://adahandle.com/', logo: 'https://pbs.twimg.com/profile_images/1438181824119721984/ATMLNczx_400x400.jpg'}
]

export const ADAHANDLE_POLICY = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

export const databases = {
  accounts:      "Finbyte Accounts",
  notifications: "Finbyte Interactions",
  votes:         "Votes",

  forum_posts:     "Forum Posts",
  forum_comments:  "Forum Comments",

  finbyte_chat:    "Finbyte Chat",
  community_posts: "Community Posts",
  communities: 'Tokens (Communities)'
};

export const moderation_addresses = [
  "addr1qx38ntczmlkdnyqm78acef790jrqr9ehjysy25trrxvhae89d6290nczn0y4ycyasla28sqqrtpytv3vuu0uqj4yu37q92rudl",
];
