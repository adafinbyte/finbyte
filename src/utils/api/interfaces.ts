import { PostgrestError } from "@supabase/supabase-js";


/** @API */
export interface safe_fetched_return {error?: PostgrestError | string, data?: any | any[]}

/** @PLATFORM_GENERAL */
export interface platform_user {
  type:    'anon' | 'finbyte';
  address: string;
}

export interface platform_user_details {
  community_posts: community_post_data[];
  forum_posts: forum_post_data[];
  forum_comments: comment_post_data[];
  first_timestamp: string;
  total_posts: number;
  total_kudos: number;
  account_data: account_data;
}

export interface account_data {
  id?:        number;
  address:    string;
  ada_handle: string | null;

  f_timestamp: number;
  l_timestamp: number | null;

  badges:          string[] | null;
  community_badge: string | null;

  /** @todo */
  profile_img: string | null;
}

/** @FORUMS_CHAT */
export interface post_with_comments {
  post:     forum_post_data;
  comments: comment_post_data[] | null;
}

export interface forum_post_data {
  id:         number;
  author:     string;
  ada_handle: string | null;

  section:   string;
  timestamp: number;
  tag:       string | null;
  title:     string;
  post:      string;

  updated_timestamp: number | null;
  updated_post:      string | null;

  post_likers: string[] | null;
  tip_hashes:  string[] | null;

  /** @todo */
  has_poll: boolean;  //for requests
  votes:    string[]; //for requests
  marked_spam: boolean | null; //general improvement
}

export interface comment_post_data {
  id:         number;
  post_id:    number;
  author:     string;
  ada_handle: string | null;

  timestamp: number;
  post:      string;

  updated_timestamp: number | null;
  updated_post:      string | null;

  post_likers: string[] | null;
  tip_hashes:  string[] | null;

  /** @todo */
  marked_spam: boolean | null; //general improvement
}

export interface community_post_data {
  id:         number;
  token_slug: string;
  author:     string;
  ada_handle: string | null;

  timestamp: number;
  title:     string;
  post:      string;

  updated_timestamp: number | null;
  updated_post:      string | null;

  post_likers: string[] | null;
  tip_hashes:  string[] | null;

  /** @todo */
  marked_spam: boolean | null; //general improvement
}

export interface create_forum_post_data {
  author:     string;
  ada_handle: string | null;

  section:   string;
  timestamp: number;
  tag:       string | null;
  title:     string;
  post:      string;

  /** @todo */
  has_poll: boolean; //for requests
}

export interface create_comment_post_data {
  author:     string;
  ada_handle: string | null;

  post_id:   number;
  timestamp: number;
  post:      string;
}

export interface create_community_post_data {
  author:     string;
  ada_handle: string | null;

  token_slug: string;
  timestamp:  number;
  post:       string;
}