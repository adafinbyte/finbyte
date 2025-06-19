import { databases } from "@/utils/consts";
import { create_community_post, create_feed_comment, create_feed_post } from "@/utils/interfaces";
import { post_type } from "@/utils/types";
import { supabase } from "../secrets";
import { create_notification } from "../misc";
import { adjust_account_kudos } from "../account/push";

interface create_post_return { error?: string; created?: boolean }
export const create_post = async (
  create_data: create_feed_post | create_feed_comment | create_community_post,
  post_type: post_type,
  author_address: string | undefined
): Promise<create_post_return> => {
  if (
    (post_type === 'feed_post' && !(create_data as create_feed_post)) ||
    ((post_type === 'feed_comment') && !(create_data as create_feed_comment)) ||
    ((post_type === 'community') && !(create_data as create_community_post))
  ) {
    return { error: 'Invalid post data type for the given post_type.' };
  }

  const db =
    post_type === 'feed_post' ?
    databases.forum_posts : post_type === 'feed_comment' ?
    databases.forum_comments : databases.community_posts;

  const { error } = await supabase.from(db).insert([create_data]).select().single();

  if (error) {
    return { error: error.message }
  } else {
    await adjust_account_kudos({
      user_addr: create_data.author,
      author_addr: author_address ?? null,
      action_type: post_type === 'feed_post' ? 'post' : 'comment'
    });

    const noti = await create_notification(post_type === 'feed_post' ? 'post:new' : 'comment:new', null, create_data.author);
    if (noti.error) { return { error: noti.error } }
    return { created: true};
  }
}

interface mark_post_as_spam_return { error?: string; marked?: boolean }
export const mark_post_as_spam = async (
  post_id: number,
  post_type: post_type,
  address: string,
): Promise<mark_post_as_spam_return> => {
  const db =
    post_type === 'feed_post' ?
    databases.forum_posts : post_type === 'feed_comment' ?
    databases.forum_comments : databases.community_posts;

  const { error } = await supabase
    .from(db)
    .update({ topic: 'spam' })
    .eq('id', post_id)
    .select()
    .single();

  if (error) {
    return { error: error.message }
  } else {
    await adjust_account_kudos({
      user_addr: address,
      author_addr: null,
      action_type: 'marked_spam'
    });

    const noti = await create_notification(post_type === 'feed_post' ? 'post:spam' : 'comment:spam', null, address);
    if (noti.error) { return { error: noti.error } }
    return { marked: true }
  }
};

interface like_unlike_post_return { error?: string; done?: boolean }
export const like_unlike_post = async (
  post_likers: string[],
  post_id: number,
  author_address: string | undefined,
  address: string,
  post_type: post_type,
  action: 'like' | 'unlike'
): Promise<like_unlike_post_return> => {
  const db =
    post_type === 'feed_post' ?
    databases.forum_posts : post_type === 'feed_comment' ?
    databases.forum_comments : databases.community_posts;

  const { error } = await supabase
    .from(db)
    .update({ post_likers: post_likers.length ? post_likers : [] })
    .eq('id', post_id)
    .single();

  if (error) {
    return { error: error.message }
  } else {
    await adjust_account_kudos({
      user_addr: address,
      author_addr: author_address ?? null,
      action_type: action === 'like' ? 'like' : 'unlike'
    });

    const noti = await create_notification(post_type === 'feed_post' ? 'post:like/unlike' : 'comment:like/unlike', post_id, address);
    if (noti.error) { return { error: noti.error } }
    return { done: true }
  }
};

interface tipped_post_return { error?: string; done?: boolean }
export const tipped_post = async (
  post_id: number,
  post_type: post_type,
  tip_hashes: string[],
  address: string,
  author_address: string,
): Promise<tipped_post_return> => {
  const db =
    post_type === 'feed_post' ?
    databases.forum_posts : post_type === 'feed_comment' ?
    databases.forum_comments : databases.community_posts;

  const { error } = await supabase
    .from(db)
    .update({ tip_tx_hashes: tip_hashes.length ? tip_hashes : [] })
    .eq('id', post_id)
    .single();

  if (error) {
    return { error: error.message }
  } else {
    await adjust_account_kudos({
      user_addr: address,
      author_addr: author_address ?? null,
      action_type: 'tip'
    });

    const noti = await create_notification('post:tip', post_id, address);
    if (noti.error) { return { error: noti.error } }
    return { done: true }
  }
};