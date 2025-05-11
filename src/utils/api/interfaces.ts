import { PostgrestError } from "@supabase/supabase-js";
import { notification_action_type } from "./types";


/** @API */
export interface safe_fetched_return {error?: PostgrestError | string, data?: any | any[]}

/** @PLATFORM_GENERAL */
export interface platform_notification {
  action:    notification_action_type;
  address:   string;
  timestamp: number;
  forum_post_id: number | null;
  token_slug: string | null;
}

export interface platform_user {
  type:    'anon' | 'finbyte';
  address: string;
}

export interface platform_user_details {
  community_posts: community_post_data[];
  forum_posts: forum_post_data[];
  forum_comments: comment_post_data[];

  total_posts: number;
  total_kudos: number;

  first_timestamp: number;

  account_data: account_data | null;
  ada_handle: string | null;
  type: 'finbyte' | 'anon';
  address: string;
}

export interface platform_community_details {
  id: number;
  token_slug: string;
  highlighted: boolean;
  f_timestamp: number;
  l_timestamp: number;
  community_likers: string[];
}

export interface account_data {
  id?:        number;
  address:    string;
  ada_handle: string | null;

  f_timestamp: number;
  l_timestamp: number | null;

  badges:          string[] | null;
  community_badge: string | null;
}

export interface create_account_data {
  f_timestamp:  number;
  address:    string;
  ada_handle: string | null;
}

/** @FORUMS_CHAT */
export interface edit_post_data {
  updated_post:      string;
  updated_timestamp: number;
  author:            string;
}

export interface post_votes {
  id:      number;
  address: string;
  vote:    string;
  post_id: number;
  timestamp: number;
}

export interface post_with_comments {
  post:     forum_post_data;
  comments: comment_post_data[] | null;
  user: platform_user_details | null;
  votes: post_votes[] | null;
}

export interface forum_post_data {
  id:         number;
  author:     string;

  section:   string;
  timestamp: number;
  tag:       string | null;
  title:     string;
  post:      string;
  request_type: string | null;

  updated_timestamp: number | null;
  updated_post:      string | null;

  post_likers: string[] | null;
  tip_hashes:  string[] | null;

  has_poll: boolean;

  /** @todo */
  //is_pinned: boolean;
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
  user: platform_user_details | null;

  /** @todo */
  marked_spam: boolean | null; //general improvement
}

export interface chat_post_data {
  id:         number;
  author:     string;

  timestamp: number;
  post:      string;

  updated_timestamp: number | null;
  updated_post:      string | null;

  post_likers: string[] | null;
  user: platform_user_details | null;

  /** @todo */
  marked_spam: boolean | null; //general improvement
}

export interface create_forum_post_data {
  author:     string;

  section:   string;
  timestamp: number;
  tag:       string | null;
  title:     string;
  post:      string;

  /** @todo */
  has_poll: boolean; //for requests
}

export interface create_comment_post_data {
  author:    string;
  post_id:   number;
  timestamp: number;
  post:      string;
}

export interface create_community_post_data {
  author:     string;
  token_slug: string;
  timestamp:  number;
  post:       string;
}