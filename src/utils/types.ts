export type post_type = 'feed_post' | 'feed_comment' | 'community';

export type notification_action = |
  'new_post' | 'new_comment' | 'like/unlike' | 'followed_user' | 'new_user' | 'muted_user' |
  'bookmarked_post' | 'marked_spam_post' | 'user_logged_in';

type error_type = |
  ""

type n_type = |
  "post" | "comment" | "user";
type n_action = |
  "new" | "removed" | "like/unlike" | "bookmarked" | "spam" |
  "follow/unfollow" | 'mute/unmute' | "login";

type notification = `${n_type}:${n_action}`