import toast from "react-hot-toast";

import { notification_type, post_type } from "./types";

import { discord_webhook_ping, supabase } from "../secrets";
import { databases } from "../consts";

import { create_chat_data, create_comment_post_data, create_community_post_data, create_forum_post_data } from "./interfaces";

export const create_notification = async (
  action:    notification_type,
  timestamp: number,
  address:   string,
) => {
  const data = {
    action,
    address,
    timestamp,
  }

  const { error } = await supabase
    .from(databases.notifications)
    .insert([data])
    .single();

  if (error) {
    toast.error(error.message);
  }
  
  try {
    if (!discord_webhook_ping) {
      console.warn("Discord webhook URL is not set");
      return;
    }

    const format_action = (action: notification_type): string => {
      switch (action) {
        case "new-forum-post":
          return 'New Forum Post';
        case "new-forum-comment":
          return 'New Comment on Forum Post';
        case "new-community-post":
          return 'New Community Post';
        case "new-chat-post":
          return 'New Chat Post';
        case "forum-post-liked":
          return 'Forum Post Liked';
        case "forum-comment-liked":
          return 'Forum Comment Liked';
        case "community-post-liked":
          return 'Community Post Liked';
        case "chat-liked":
          return 'Chat Post Liked';
        case "forum-post-unliked":
          return 'Forum Post Unliked';
        case "forum-comment-unliked":
          return 'Forum Comment Unliked';
        case "community-post-unliked":
          return 'Community Post Unliked';
        case "chat-unliked":
          return 'Chat Post Unliked';
        case "forum-post-edited":
          return 'Forum Post Edited';
        case "forum-comment-edited":
          return 'Forum Comment Edited';
        case "community-post-edited":
          return 'Community Post Edited';
        case "chat-edited":
          return 'Chat Post Edited';
        case "forum-post-deleted":
          return 'Forum Post Deleted';
        case "forum-comment-deleted":
          return 'Forum Comment Deleted';
        case "community-post-deleted":
          return 'Community Post Deleted';
        case "forum-post-tipped":
          return 'Forum Post Tipped';
        case "forum-comment-tipped":
          return 'Forum Comment Tipped';
        case "community-post-tipped":
          return 'Community Post Tipped';
        case "new-account":
          return 'New Account Created';
        case "updated-adahandle":
          return 'A user has updated their adahandle!';
        case "updated-community-badge":
          return 'A user has updated their community badge!';
        default:
          return '';
      }
    }

    const discord_post_text = `
:mega: **${format_action(action)}**
:bust_in_silhouette: *${address}*
:clock:  *${timestamp}*
    `;

    await fetch(discord_webhook_ping, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: discord_post_text
      }),
    });
  } catch (err) {
    console.error("Failed to send Discord webhook:", err);
  }
}

export const create_post = async (
  create_data: create_forum_post_data | create_community_post_data | create_comment_post_data,
  post_type:   post_type,
  timestamp:   number,
  address:     string
) => {
  if (
    (post_type === 'forum_post' && !(create_data as create_forum_post_data)) ||
    (post_type === 'forum_comment' && !(create_data as create_comment_post_data)) ||
    (post_type === 'community_post' && !(create_data as create_community_post_data)) ||
    (post_type === 'chat' && !(create_data as create_chat_data))
  ) {
    toast.error('Invalid post data type for the given post_type.');
    return;
  }

  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments :
    post_type === 'community_post' ?
    databases.community_posts :
    databases.chat;

  const noti_type: notification_type =
    post_type === 'forum_post' ?
    'new-forum-post' :
    post_type === 'forum_comment' ?
    'new-forum-comment' :
    post_type === 'community_post' ?
    'new-community-post' : 'new-chat-post';

  const { error } = await supabase
    .from(db).insert([create_data]).single();

  if (error) {
    toast.error(error.message);
  } else {
    await create_notification(noti_type, timestamp, address);
    toast.success('A new post has been created. Kudos!');
  }
}

export const like_unlike_post = async (
  like_data: string[],
  post_id: number,
  timestamp: number,
  address: string,
  post_type: post_type,
  action: 'like' | 'unlike'
) => {
  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments :
    post_type === 'community_post' ?
    databases.community_posts : databases.chat;

  let noti_type: notification_type | null = null;

  if (action === 'like') {
    noti_type =
      post_type === 'forum_post'
        ? 'forum-post-liked'
        : post_type === 'forum_comment'
        ? 'forum-comment-liked'
        : post_type === 'community_post'
        ? 'community-post-liked' : 'chat-liked';
  } else if (action === 'unlike') {
    noti_type =
      post_type === 'forum_post'
        ? 'forum-post-unliked'
        : post_type === 'forum_comment'
        ? 'forum-comment-unliked'
        : post_type === 'community_post'
        ? 'community-post-unliked' : 'chat-unliked';
  }

  const { error } = await supabase
    .from(db)
    .update({ post_likers: like_data.length ? like_data : [] })
    .eq('id', post_id)
    .single();

  if (error) {
    toast.error(error.message);
  } else {
    if (noti_type) {
      await create_notification(noti_type, timestamp, address);
    }

    toast.success(
      action === 'like'
        ? 'A new like has been added! Kudos.'
        : 'Like removed successfully.'
    );
  }
};

export const edit_post = async (
  post_id:      number,
  address:      string,
  updated_post: string,
  timestamp:    number,
  post_type:    post_type,
) => {
  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments :
    post_type === 'community_post' ?
    databases.community_posts : databases.chat;

  const noti_type: notification_type =
    post_type === 'forum_post' ?
    'forum-post-edited' :
    post_type === 'forum_comment' ?
    'forum-comment-edited' :
    post_type === 'community_post' ?
    'community-post-edited' : 'chat-edited';

  const { error } = await supabase
    .from(db)
    .update({
        updated_post: updated_post,
        updated_timestamp: timestamp
      }
    )
    .eq('id', post_id);

  if (error) {
    toast.error(error.message);
  } else {
    await create_notification(noti_type, timestamp, address);
    /** We refernce the user directly as team is not allowed to edit posts */
    toast.success('Your post has been updated! Kudos.');
  }
}

export const update_tip_tx_hashes = async (
  address:   string,
  tx_hashes: string[],
  post_id:   number,
  post_type: post_type
) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments : databases.community_posts;

  const noti_type: notification_type =
    post_type === 'forum_post' ?
    'forum-post-tipped' :
    post_type === 'forum_comment' ?
    'forum-comment-tipped' : 'community-post-tipped';

  const { error: ace } = await supabase
    .from(databases.accounts)
    .update({
        tip_tx_hashes: tx_hashes,
      }
    )
    .eq('address', address);

  const { error: pe } = await supabase
    .from(db)
    .update({
        tip_tx_hashes: tx_hashes,
      }
    )
    .eq('id', post_id);

  if (ace) {
    toast.error(ace.message);
  } else if (pe) {
    toast.error(pe.message);
  } else {
    await create_notification(noti_type, timestamp, address);
    toast.success('Your username has been updated! Kudos.');
  }
}