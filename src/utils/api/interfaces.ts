export interface platform_notification {
  action: string;
  address: string;
  timestamp: number;

  /** 
   * @note
   * - used for forum posts and comments
   * - post_type = forum_post should use post.id
   * - post_type = forum_comment should use post.post_id
   * */
  forum_post_id: number | null;

  /** @note - used for community posts */
  token_slug: string | null;
}

export interface chat_post_data {
  id:                number;
  author:            string;
  timestamp:         number;
  post:              string;
  updated_timestamp: number | null;
  updated_post:      string | null;
  post_likers:       string[] | null;

  user: platform_user_details | null;
}

export interface create_chat_post_data {
  author:            string;
  timestamp:         number;
  post:              string;
}

export interface platform_user_details {
//  community_posts: community_post_data[];
//  forum_posts: forum_post_data[];
//  forum_comments: comment_post_data[];
  finbyte_chats: chat_post_data[];

  total_posts: number;
  finbyte_kudos: number;

  first_timestamp: number;

  account_data: finbyte_account_data | null;
  ada_handle: string | null;
  type: 'finbyte' | 'anon';
  address: string;
}

export interface finbyte_account_data {
  address:    string;
  ada_handle: string | null;

  f_timestamp: number;
  l_timestamp: number | null;

  badges:          string[] | null;
  community_badge: string | null;
}

export interface create_platform_user_data {
  address:    string;
  ada_handle: string | null;
  timestamp:  number;
}