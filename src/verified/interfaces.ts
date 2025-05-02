
export interface verified_token {
  slug_id:     string;
  name:        string;
  hex:         string | undefined;
  description: string;
  category?:       string;
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
    collection?: string[];
  };
  links: {
    cardanoscan?: string;
    discord?:     string;
    github?:      string;
    reddit?:      string;
    telegram?:    string;
    website?:     string;
    x?:           string;
  };
  finbyte?: {
    forum_post_announcement?: string;
  }
}
