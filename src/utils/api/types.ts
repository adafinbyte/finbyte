
export type notification_type = |
  // new post actions
  'new-forum-post' | 'new-forum-comment' | 'new-community-post' | 'new-chat-post' |
  // post like actions
  'forum-post-liked' | 'forum-comment-liked' | 'community-post-liked' | 'chat-liked' |
  // post unlike actions
  'forum-post-unliked' | 'forum-comment-unliked' | 'community-post-unliked' | 'chat-unliked' |
  // post edit actions
  'forum-post-edited' | 'forum-comment-edited' | 'community-post-edited' | 'chat-edited' |
  // post delete actions
  'forum-post-deleted' | 'forum-comment-deleted' | 'community-post-deleted' |
  // tip actions
  'forum-post-tipped' | 'forum-comment-tipped' | 'community-post-tipped' |
  // user actions
  'new-account' | 'updated-adahandle' | 'updated-community-badge';

export type post_type = |
  'forum_post' | 'forum_comment' | 'community_post' | 'chat';