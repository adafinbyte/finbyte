
/** @contents - moderator actions */

import toast from "react-hot-toast";
import { databases } from "../consts";
import { supabase } from "../secrets";
import { notification_type, post_type } from "./types";
import { create_notification } from "./push";

export const delete_post = async (
  post_id:   number,
  post_type: post_type,
  address:   string,
  timestamp: number,
) => {
  const db =
    post_type === 'forum_post' ?
    databases.forum_posts :
    post_type === 'forum_comment' ?
    databases.forum_comments : databases.community_posts;

  const noti_type: notification_type =
    post_type === 'forum_post' ?
    'forum-post-deleted' :
    post_type === 'forum_comment' ?
    'forum-comment-deleted' : 'community-post-deleted';

  const { error } = await supabase
    .from(db)
    .delete()
    .eq('id', post_id)
    .single();

  if (error) {
    toast.error(error.message);
  } else {
    await create_notification(noti_type, timestamp, address);
    toast.success('This post has now been deleted.');
  }
}