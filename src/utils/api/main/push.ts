import { databases } from "../../consts";
import { supabase } from "../../secrets";
import { create_forum_post_data, safe_fetched_return } from "../interfaces";
import { notification_type, post_type } from "../types";


/** @todo the rest of the post types for create_data */
export const create_post = async (
  create_data: create_forum_post_data,// | create_community_post_data | create_comment_post_data,
  post_type:   post_type,
  timestamp:   number,
  address:     string
): Promise<safe_fetched_return | void> => {
  if (
    (post_type === 'forum_post' && !(create_data as create_forum_post_data))// ||
//    (post_type === 'forum_comment' && !(create_data as create_comment_post_data)) ||
//    (post_type === 'community_post' && !(create_data as create_community_post_data)) ||
//    (post_type === 'chat' && !(create_data as create_chat_data))
  ) {
    return { error: 'Invalid post data type for the given post_type.' };
  }

  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments :
    post_type === 'community_post' ?
    databases.community_posts :
    databases.finbyte_chat;

  const noti_type: notification_type =
    (post_type === 'forum_post' || post_type === 'community_post') ?
    'new-post' : post_type === 'forum_comment' ?
    'new-comment' : 'new-chat';

  const { error } = await supabase.from(db).insert([create_data]).single();

  if (error) {
    return { error: error.message }
  } else {
//    await create_notification(noti_type, timestamp, address);
    return;
  }
}