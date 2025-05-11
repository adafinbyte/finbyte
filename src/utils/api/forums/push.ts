import { time } from "console";
import { databases } from "../../consts";
import { supabase } from "../../secrets";
import { create_comment_post_data, create_community_post_data, create_forum_post_data, safe_fetched_return } from "../interfaces";
import { notification_action_type, post_type } from "../types";
import { create_notification } from "../misc";

export const create_post = async (
  create_data: create_forum_post_data | create_community_post_data | create_comment_post_data,
  post_type:   post_type,
  timestamp:   number,
  address:     string
): Promise<safe_fetched_return | void> => {
  if (
    (post_type === 'forum_post' && !(create_data as create_forum_post_data)) ||
    ((post_type === 'forum_comment' || post_type === 'finbyte_chat') && !(create_data as create_comment_post_data)) ||
    (post_type === 'community_post' && !(create_data as create_community_post_data))
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
    await create_notification(
      timestamp,
      address,
      (post_type === 'forum_post' || post_type === 'community_post') ?
        'New Post' : post_type === 'forum_comment' ?
        'New Comment' : 'New Chat',
      post_type,
      {
        forum_post_id:
          post_type === 'forum_post' ? data.id :
          post_type === 'forum_comment' ? data.post_id :
          post_type === 'community_post' ? data.token_slug :
          null,
        /**@ts-ignore */
        token_slug: post_type === 'community_post' ? create_data.token_slug : null
      }
    );

    if (post_type === 'forum_post') {
      /** @note so we can push to the page */
      return { data: data.id }
    }
    return;
  }
}

export const toggle_vote = async ({
  postId,
  address,
  voteType,
  timestamp,
}: {
  postId: number;
  address: string;
  voteType: 'yes' | 'no';
  timestamp: number;
}): Promise<safe_fetched_return | void> => {
  let voteChanged = false;

  const { data: existing, error: fetchError } = await supabase.from(databases.votes).select('*').eq('post_id', postId).eq('address', address).single();
  if (fetchError && fetchError.code !== 'PGRST116') {
    return { error: fetchError.message };
  }

  if (existing && existing.vote === voteType) {
    const { error: deleteError } = await supabase.from(databases.votes).delete().eq('id', existing.id);
    if (deleteError) return { error: deleteError.message };
    voteChanged = true;
  } else if (existing) {
    const { error: updateError } = await supabase.from(databases.votes).update({ vote: voteType, timestamp }).eq('id', existing.id);
    if (updateError) return { error: updateError.message };
    voteChanged = true;
  } else {
    const { error: insertError } = await supabase.from(databases.votes).insert([
      {
        post_id: postId,
        address,
        vote: voteType,
        timestamp,
      },
    ]);

    if (insertError) return { error: insertError.message };
    voteChanged = true;
  }

  if (voteChanged) {
    await create_notification(
      timestamp,
      address,
      'Vote Casted',
      'forum_post',
      {forum_post_id: postId, token_slug: null}
    );
  }
};

export const like_unlike_post = async (
  post_likers: string[],
  post_id: number,
  timestamp: number,
  address: string,
  post_type: post_type,
  action: 'like' | 'unlike'
): Promise<safe_fetched_return | void> => {
  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments :
    post_type === 'community_post' ?
    databases.community_posts : databases.finbyte_chat;

  const noti_type: notification_action_type = action === 'like' ?
    (post_type === 'forum_post' || post_type === 'community_post') ?
    'Post Liked' : post_type === 'forum_comment' ? 'Comment Liked' :
    'Chat Liked' :
    (post_type === 'forum_post' || post_type === 'community_post') ?
    'Post Unliked' : post_type === 'forum_comment' ? 'Comment Unliked' :
    'Chat Unliked'

  const { data, error } = await supabase
    .from(db)
    .update({ post_likers: post_likers })
    .eq('id', post_id)
    .select()
    .single();

  if (error) {
    return { error: error.message }
  } else {
    await create_notification(
      timestamp,
      address,
      noti_type,
      post_type,
      {forum_post_id: data.post_id, token_slug: null}
    );
  }
};