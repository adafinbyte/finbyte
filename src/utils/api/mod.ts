import { databases } from "@/utils/consts";
import { supabase } from "@/utils/secrets";
import { notification_action_type, post_type } from "./types";
import { safe_fetched_return } from "./interfaces";
import { create_notification } from "./misc";

export const delete_post = async (
  post_id:   number,
  post_type: post_type,
  address:   string,
  timestamp: number,
): Promise<safe_fetched_return | void> => {
  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments : post_type === 'community_post' ?
    databases.community_posts : databases.finbyte_chat;

  const noti_type: notification_action_type =
    (post_type === 'forum_post' || post_type === 'community_post') ?
      'Deleted Post' :
      post_type === 'forum_comment' ?
      'Deleted Comment' : 'Deleted Chat';

  const { error } = await supabase
    .from(db)
    .delete()
    .eq('id', post_id)
    .single();

  if (error) {
    return { error: error.message }
  } else {
    await create_notification(
      timestamp,
      address,
      noti_type,
      post_type,
      {forum_post_id: null, token_slug: null}
    );
    return;
  }
}