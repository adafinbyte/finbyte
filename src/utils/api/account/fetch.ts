import { databases } from "@/utils/consts";
import { supabase } from "../secrets";
import { comment_post_data, forum_post_data, platform_user_details } from "@/utils/interfaces";

interface fetch_user_data_return { error?: string; data?: platform_user_details}
export const fetch_user_data = async (author: string): Promise<fetch_user_data_return> => {
  let forum_posts: forum_post_data[] = [];
  let forum_comments: comment_post_data[] = [];
  let first_timestamp: string | number;
  const timestamps: string[] = [];
  let total_kudos = 0;

  const { data, error } = await supabase.rpc('search_author', { author_query: author });
  if (error) { return { error: error.message } }

  const forumPostIds = new Set<number>();

  data?.forEach((row: any) => {
    if (row.db === databases.forum_posts) {
      forum_posts.push({ ...row, type: 'forum_post', id: row.post_id });
      timestamps.push(row.post_timestamp);
      total_kudos += 1;
      total_kudos += (row.post_likers?.length ?? 0) * 2;
      total_kudos += (row.tip_tx_hashes?.length ?? 0) * 3;

      forumPostIds.add(row.post_id);
    }

    else if (row.db === databases.forum_comments) {
      forum_comments.push({ ...row, type: 'forum_comment' });
      timestamps.push(row.comment_timestamp);
      total_kudos += 1;
      total_kudos += (row.post_likers?.length ?? 0) * 2;
      total_kudos += (row.tip_tx_hashes?.length ?? 0) * 3;
    }

  });

  if (forumPostIds.size > 0) {
    const { data: allPostComments, error: postCommentsError } = await supabase
      .from(databases.forum_comments)
      .select('post_id')
      .in('post_id', Array.from(forumPostIds));

    if (postCommentsError) {
      return { error: postCommentsError.message }
    } else {
      total_kudos += allPostComments.length;
    }
  }

  first_timestamp = timestamps.reduce((minTimestamp, timestamp) => {
    return new Date(timestamp) < new Date(minTimestamp) ? timestamp : minTimestamp;
  }, timestamps[0] || new Date().toISOString());

  const total_posts = forum_posts.length + forum_comments.length;

  const { data: ad, error: ade } = await supabase
    .from(databases.accounts).select('*').eq('address', author).single();
  if (ade) { return { error: ade.message } }
  if (ad) {
    total_kudos += (ad.bookmarked_posts?.length ?? 0);
    total_kudos += (ad.following?.length ?? 0);
  }

  const platform_details: platform_user_details = {
    id: ad.id,
    forum_posts,
    forum_comments,
    total_posts,
    total_kudos,
    first_timestamp: Number(first_timestamp),
    address: ad.address,
    ada_handle: ad.ada_handle,
    f_timestamp: ad.f_timestamp,
    l_timestamp: ad.l_timestamp,
    badges: ad.badges,
    community_badge: ad.community_badge,
    following: ad.following,
    muted: ad.muted,
    bookmarked_posts: ad.bookmarked_posts
  };

  return { data: platform_details }
};
