export type post_type = 'feed_post' | 'feed_comment';

export type notification_action = |
 'new_post' | 'new_comment' | 'like/unlike' | 'followed_user' | 'new_user' | 'muted_user' |
 'bookmarked_post' | 'marked_spam_post' | 'user_logged_in';