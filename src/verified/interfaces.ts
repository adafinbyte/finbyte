interface collection_item {
  title: string;
  image: string;
  url:   string;
  description: string;
}

export interface curated_token {
  slug_id:     string;
  name:        string;
  hex:         string | undefined;
  description: string;
  category:    string;
  token_details: {
    ticker:      string;
    policy:      string | undefined;
    fingerprint: string | undefined;
    supply:      number;
    decimals:    number;
  };
  images: {
    logo:        string;
    header?:     string;
  };
  links: {
    discord?:     string;
    github?:      string;
    reddit?:      string;
    telegram?:    string;
    website?:     string;
    x?:           string;
  };
  finbyte?: {
    collection?: collection_item[];
    donate_wallet?: string;
  }
}
