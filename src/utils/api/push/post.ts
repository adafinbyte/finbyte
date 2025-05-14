import { post_type } from "@/utils/types";
import { create_chat_post_data } from "../interfaces";
import { databases } from "@/utils/consts";
import { supabase } from "@/utils/secrets";
import { create_notification } from "../misc";

interface create_post_return { error?: string; created?: boolean; forum_post_id?: number; }
export const create_post = async (
  create_data: create_chat_post_data,
  post_type:   post_type,
  timestamp:   number,
  address:     string
): Promise<create_post_return> => {
  if (
    (post_type === 'finbyte_chat' && !(create_data as create_chat_post_data))
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

  const { data, error } = await supabase.from(db).insert([create_data]).select().single();

  if (error) {
    return { error: error.message }
  } else {
    const notification = await create_notification(
      post_type === 'forum_comment' ?
        'New Comment Created' : post_type === 'finbyte_chat' ?
        'New Chat Created' : 'New Post Created',
      address,
      timestamp,
      post_type === 'forum_post' ? data.id : post_type === 'finbyte_chat' ? data.post_id : null,
      post_type === 'community_post' ? data.token_slug : null,
      post_type,
    );
      if (notification.error) {
        return { error: notification.error}
      }
      if (notification.created) {
      /** @note so we can push to the page */
      if (post_type === 'forum_post') {
        return { forum_post_id: data.id, created: true }
      }

      return { created: true };
    }
  }

  return {}
}
