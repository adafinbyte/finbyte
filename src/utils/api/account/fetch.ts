
import { databases } from "@/utils/consts";
import { supabase } from "@/utils/secrets";
import { account_data, fetched_comment_post_data, fetched_community_post_data, fetched_forum_post_data } from "../interfaces";
import toast from "react-hot-toast";

export const fetch_username_from_account = async (author: string): Promise<string | undefined> => {
  const { data } = await supabase
    .from(databases.accounts)
    .select('ada_handle')
    .eq('address', author)
    .single();
  return data?.ada_handle ?? undefined;
}

export interface author_data {
  communityPosts: fetched_community_post_data[];
  forumPosts: fetched_forum_post_data[];
  forumComments: fetched_comment_post_data[];
  earliestTimestamp: string;
  totalPosts: number;
  totalKudos: number;
  accountData: account_data;
}

export const fetch_author_data = async (author: string): Promise<author_data | null> => {
  let communityPosts: fetched_community_post_data[] = [];
  let forumPosts: fetched_forum_post_data[] = [];
  let forumComments: fetched_comment_post_data[] = [];
  let earliestTimestamp = '';
  const timestamps: string[] = [];
  let totalKudos = 0;

  const { data, error } = await supabase.rpc('search_author', { author_query: author });

  if (error) {
    toast.error('Error searching for author: ' + error.message);
    return null;
  }

  const forumPostIds = new Set<number>();

  data?.forEach((row: any) => {
    const postTimestamp = row.post_timestamp?.toString() || '';

    if (row.db === databases.community_posts) {
      communityPosts.push({ ...row, type: 'communityPost' });
      timestamps.push(postTimestamp);
      totalKudos += 1;
      totalKudos += (row.post_likers?.length ?? 0) * 2;
      totalKudos += (row.tip_tx_hashes?.length ?? 0) * 3;
    }

    else if (row.db === databases.forum_posts) {
      forumPosts.push({ ...row, type: 'forumPost' });
      timestamps.push(postTimestamp);
      totalKudos += 1;
      totalKudos += (row.post_likers?.length ?? 0) * 2;
      totalKudos += (row.tip_tx_hashes?.length ?? 0) * 3;

      forumPostIds.add(row.post_id);
    }

    else if (row.db === databases.forum_comments) {
      forumComments.push({ ...row, type: 'forumComment' });
      timestamps.push(postTimestamp);
      totalKudos += 1;
      totalKudos += (row.post_likers?.length ?? 0) * 2;
      totalKudos += (row.tip_tx_hashes?.length ?? 0) * 3;
    }
  });

  if (forumPostIds.size > 0) {
    const { data: allPostComments, error: postCommentsError } = await supabase
      .from(databases.forum_comments)
      .select('post_id')
      .in('post_id', Array.from(forumPostIds));

    if (postCommentsError) {
      toast.error('Error fetching forum post comments: ' + postCommentsError.message);
    } else {
      totalKudos += allPostComments.length;
    }
  }

  earliestTimestamp = timestamps.reduce((minTimestamp, timestamp) => {
    return new Date(timestamp) < new Date(minTimestamp) ? timestamp : minTimestamp;
  }, timestamps[0] || new Date().toISOString());

  const totalPosts = communityPosts.length + forumPosts.length + forumComments.length;

  const { data: ad } = await supabase
    .from(databases.accounts).select('*').eq('address', author).single();

  return {
    communityPosts,
    forumPosts,
    forumComments,
    earliestTimestamp,
    totalPosts,
    totalKudos,
    accountData: ad
  };
};
