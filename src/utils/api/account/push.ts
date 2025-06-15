import { databases } from "@/utils/consts";
import { supabase } from "../secrets";
import { create_notification } from "../misc";

interface bookmarked_post_return { error?: string; done?: boolean }
export const bookmarked_post = async (
  post_id: number,
  address: string,
  bookmarked_posts: number[]
): Promise<bookmarked_post_return> => {
  const is_bookmarked = bookmarked_posts.includes(post_id);

  const updated_bookmarks = is_bookmarked
    ? bookmarked_posts.filter(id => id !== post_id)
    : [...bookmarked_posts, post_id];

  const { error } = await supabase
    .from(databases.accounts)
    .update({ bookmarked_posts: updated_bookmarks })
    .eq('address', address)
    .single();

  if (error) {
    return { error: error.message }
  } else {
    const noti = await create_notification('post:bookmarked', null, address);
    if (noti.error) { return { error: noti.error } }
    return { done: true };
    //noti
  }
};

interface mute_user_return { error?: string; done?: boolean }
export const mute_user = async (
  muting_address: string,
  address: string,
  user_muted_users: string[]
): Promise<mute_user_return> => {
  const is_muted = user_muted_users.includes(muting_address);

  const updated_muted = is_muted
    ? user_muted_users.filter(ad => ad !== muting_address)
    : [...user_muted_users, muting_address];

  const { error } = await supabase
    .from(databases.accounts)
    .update({ muted: updated_muted })
    .eq('address', address)
    .single();

  if (error) {
    return { error: error.message }
  } else {
    const noti = await create_notification('user:mute/unmute', null, address);
    if (noti.error) { return { error: noti.error } }
    return { done: true }
  }
};

interface mute_user_return { error?: string; done?: boolean }
export const follow_user = async (
  follow_address: string,
  address: string,
  user_following: string[]
): Promise<mute_user_return> => {
  const is_following = user_following.includes(follow_address);

  const updated_following = is_following
    ? user_following.filter(ad => ad !== follow_address)
    : [...user_following, follow_address];

  const { error } = await supabase
    .from(databases.accounts)
    .update({ following: updated_following })
    .eq('address', address)
    .single();

  if (error) {
    return { error: error.message }
  } else {
    const noti = await create_notification('user:follow/unfollow', null, address);
    if (noti.error) { return { error: noti.error } }
    return { done: true }
    //noti
  }
};