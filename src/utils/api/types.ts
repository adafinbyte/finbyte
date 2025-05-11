
export type post_type = |
  'forum_post' | 'forum_comment' |
  'community_post' | 'finbyte_chat';

export type notification_action_type = |
  'New Post' | 'Edited Post' | 'Deleted Post' | 'Tipped Post' |
  'New Comment' | 'Edited Comment' | 'Deleted Comment' | 'Tipped Comment' |
  'New Chat' | 'Edited Chat' | 'Deleted Chat' | 'Tipped Chat' |
  'Post Liked' | 'Chat Liked' | 'Comment Liked' |
  'Post Unliked' | 'Chat Unliked' | 'Comment Unliked' |
  'New Account' | 'Updated AdaHandle' | 'Account Deleted' | 'Updated Community Badge' |
  'Vote Casted';