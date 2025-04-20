import { notification_type } from "./types";

export interface edit_post_data {
  updated_post:      string;
  updated_timestamp: number;
  author:            string;
}

/** data for a fetched forum post with comments */
export interface post_with_comments {
  post: fetched_forum_post_data;
  comments: fetched_comment_post_data[] | null;
}

/** data for a fetched forum post */
export interface fetched_forum_post_data {
  id:              number;
  section:         string;

  author:          string;
  ada_handle:      string | undefined | null;
  timestamp:       number;

  tag:             string;
  title:           string;
  post:            string;

  has_poll:        boolean;
  votes:           string[] | null; //"o" = yes, "x" = no

  updated_post:    string | null;
  updated_timestamp: number | null;

  post_likers:     string[] | null;

  tip_tx_hashes:   string[] | null;

  /** @todo */
  marked_spam:     boolean | null;
}

/** data for a creating forum post */
export interface create_forum_post_data {
  tag:       string | null;
  title:     string;
  post:      string;
  author:    string;
  timestamp: number;
  section:   string;
  has_poll:  boolean;

  ada_handle: string | undefined | null;
}

/** data for a fetched forum comment */
export interface fetched_comment_post_data {
  id:              number;
  post_id:         number;

  ada_handle:      string | null;
  author:          string;
  timestamp:       number;

  post:         string;

  updated_post:    string | null;
  updated_timestamp: number | null;

  post_likers:     string[] | null;

  tip_tx_hashes:   string[] | null;

  /** @todo */
  marked_spam:     boolean;
}

/** data for a creating forum comment */
export interface create_comment_post_data {
  post_id:   number;
  post:   string;

  ada_handle: string | undefined | null;
  author:    string;
  timestamp: number;
}

/** data for a fetched community post */
export interface fetched_community_post_data {
  id?:        number;
  token_slug: string;

  ada_handle: string | undefined;
  author:     string;
  timestamp:  number;

  post:       string;

  updated_post:      string | undefined;
  updated_timestamp: number | undefined;

  post_likers:       string[] | undefined;

  tip_tx_hashes:   string[] | null;


  /** @todo */
  marked_spam: boolean | undefined;
}

/** data for a creating community post */
export interface create_community_post_data {
  token_slug:  string;
  post:        string;

  ada_handle: string | undefined | null;
  author:      string;
  timestamp:   number;
}

export interface account_data {
  id?:             number;
  timestamp:       number;
  address:         string;
  ada_handle:      string   | undefined;

  roles:           string[] | undefined;

  badges:          string[] | undefined;
  community_badge: string   | undefined;

  ra_timestamp:    number   | undefined;

  /** @todo */
  profile_img:     string   | undefined;
}

export interface create_account_data {
  timestamp:  number;
  address:    string;
  ada_handle: string | undefined;
}

export interface platform_interaction {
  id?:       number;
  timestamp: number;
  action:    notification_type;
  address:   string;
}

export interface nonce_data {
  id: number;
  user_address: string;
  nonce: string;
  created_at: string;
}