import { supabase } from "@/utils/secrets";
import { account_data, comment_post_data, community_post_data, forum_post_data, platform_user_details, safe_fetched_return } from "../interfaces";
import { databases } from "@/utils/consts";

export const fetch_author_data = async (author: string): Promise<safe_fetched_return> => {
  let community_posts: community_post_data[] = [];
  let forum_posts: forum_post_data[] = [];
  let forum_comments: comment_post_data[] = [];
  let first_timestamp = '0';
  const timestamps: string[] = [];
  let total_kudos = 0;

  const { data, error } = await supabase.rpc('search_author', { author_query: author });

  if (error) {
    return { error: error.message }
  }

  const forumPostIds = new Set<number>();

  data?.forEach((row: any) => {
    const postTimestamp = row.post_timestamp?.toString() || '';

    if (row.db === databases.community_posts) {
      community_posts.push({ ...row, type: 'community_post' });
      timestamps.push(postTimestamp);
      total_kudos += 1;
      total_kudos += (row.post_likers?.length ?? 0) * 2;
      total_kudos += (row.tip_tx_hashes?.length ?? 0) * 3;
    }

    if (row.db === databases.forum_posts) {
      forum_posts.push({ ...row, type: 'forum_post' });
      timestamps.push(postTimestamp);
      total_kudos += 1;
      total_kudos += (row.post_likers?.length ?? 0) * 2;
      total_kudos += (row.tip_tx_hashes?.length ?? 0) * 3;

      forumPostIds.add(row.post_id);
    }

    else if (row.db === databases.forum_comments) {
      forum_comments.push({ ...row, type: 'forum_comment' });
      timestamps.push(postTimestamp);
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

  const total_posts = community_posts.length + forum_posts.length + forum_comments.length;

  const { data: ad } = await supabase
    .from(databases.accounts).select('*').eq('address', author).single();

  const platform_details: platform_user_details = {
    community_posts,
    forum_posts,
    forum_comments,
    first_timestamp,
    total_posts,
    total_kudos,
    account_data: ad as account_data
  };

  return {data: platform_details}
};

export const fetch_username_from_account = async (author: string): Promise<string | undefined> => {
  const { data } = await supabase
    .from(databases.accounts)
    .select('ada_handle')
    .eq('address', author)
    .single();
  return data?.ada_handle ?? undefined;
}
