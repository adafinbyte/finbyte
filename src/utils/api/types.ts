

export type notification_type = |
  // new post actions
  'new-forum-post' | 'new-forum-comment' | 'new-community-post' |
  // post like actions
  'forum-post-liked' | 'forum-comment-liked' | 'community-post-liked' |
  // post unlike actions
  'forum-post-unliked' | 'forum-comment-unliked' | 'community-post-unliked' |
  // post edit actions
  'forum-post-edited' | 'forum-comment-edited' | 'community-post-edited' |
  // post delete actions
  'forum-post-deleted' | 'forum-comment-deleted' | 'community-post-deleted' |
  // tip actions
  'forum-post-tipped' | 'forum-comment-tipped' | 'community-post-tipped' |
  // user actions
  'new-account' | 'updated-adahandle';

export type post_type = |
  'forum_post' | 'forum_comment' | 'community_post';