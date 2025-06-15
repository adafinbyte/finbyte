export type post_type = 'feed_post' | 'feed_comment' | 'community';

type notification_type =
  | { type: "post"; action: "new" | "removed" | "like/unlike" | "bookmarked" | "spam" | "tip" }
  | { type: "comment"; action: "new" | "removed" | "like/unlike" | "spam" | "tip" }
  | { type: "user"; action: "follow/unfollow" | "mute/unmute" | "login" };

export type notification = `${notification_type['type']}:${notification_type['action']}`;