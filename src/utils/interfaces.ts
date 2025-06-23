

export interface full_post_data {
  post: forum_post_data;
  comments: comment_post_data[];
  author_details: platform_user_details | null;
}

export interface forum_post_data {
  id:         number;
  author:     string;

  topic:     string;
  post_timestamp: number;
  post:      string;
  request_type: string | null;

  updated_timestamp: number | null;
  updated_post:      string | null;

  tip_tx_hashes: string[] | null;
  post_likers: string[] | null;
  type?: 'post';
}

export interface comment_post_data {
  id:         number;
  post_id:    number;

  author:     string;
  comment_timestamp: number;
  post:      string;

  updated_timestamp: number | null;
  updated_post:      string | null;

  post_likers: string[] | null;
  type?: 'comment';
}

export interface community_post_data {
  id:         number;
  token_slug: string;
  author:     string;
  post_timestamp: number;
  post:      string;
  updated_timestamp: number | null;
  updated_post:      string | null;
  post_likers: string[] | null;
  topic: string; /** @note our cheat to mark posts as spam */
}

export interface platform_user_details {
  id: number;
  forum_posts: forum_post_data[];
  forum_comments: comment_post_data[];
  total_posts: number;
  total_kudos: number;

  first_timestamp: number;
  address:    string;
  ada_handle: string | null;

  community_badge:  string | null;
  badges:           string[] | null;
  following:        string[] | null;
  muted:            string[];
  bookmarked_posts: number[] | null;
}

export interface finbyte_general_stats {
  forum_posts: number;
  forum_comments: number;
  community_posts: number;
  total_posts: number;
  likes_given: number;
  unique_users: number;
  interactions: number;
}

export interface create_feed_post {
  author:    string;
  topic:     string;
  post_timestamp: number;
  post:      string;
}

export interface create_feed_comment {
  author:    string;
  post:      string;
  post_id:   number;
  comment_timestamp: number;
}

export interface create_community_post {
  author:    string;
  post:      string;
  token_slug: string;
  post_timestamp: number;
}

export interface project_community_data {
  id: number;
  token_slug: string;
  community_likers: string[] | null;
  highlighted: boolean | null;
  posts: number;
  visits: number;
}

export interface tfin_requests_data {
  id: number;
  requested_timestamp: number;
  address: string;
  fulfilled: boolean | null;
  tx_hash: string | null;
}