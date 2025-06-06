import { databases } from "@/utils/consts";
import { supabase } from "../secrets";
import { community_post_data, full_post_data } from "@/utils/interfaces";

interface fetch_all_feed_posts_return {
  error?: string;
  data?: full_post_data[];
}

export const fetch_all_feed_posts = async (
  limit: number = 10,
  offset: number = 0
): Promise<fetch_all_feed_posts_return> => {
  const { data, error } = await supabase.rpc("fetch_paginated_active_posts", {
    limit_count: limit,
    offset_count: offset,
  });

  if (error) return { error: error.message };
  if (!data) return { data: [] };

  const postMap = new Map<number, full_post_data>();

  for (const row of data) {
    const postId = row.id;

    if (!postMap.has(postId)) {
      postMap.set(postId, {
        post: {
          id: row.id,
          author: row.author,
          topic: row.topic,
          post_timestamp: row.post_timestamp,
          post: row.post,
          updated_timestamp: row.updated_timestamp,
          updated_post: row.updated_post,
          post_likers: row.post_likers,
          request_type: null,
        },
        comments: [],
        author_details: null, // This will be enriched elsewhere
      });
    }

    if (row.comment_id) {
      postMap.get(postId)?.comments.push({
        id: row.comment_id,
        post_id: row.comment_post_id,
        author: row.comment_author,
        post: row.comment_text,
        /**@ts-ignore */
        comment_timestamp: row.comment_timestamp,
        updated_timestamp: row.comment_updated_timestamp,
      });
    }
  }

  return { data: Array.from(postMap.values()) };
};

interface fetch_single_feed_post_return { error?: string; data?: full_post_data }
export const fetch_single_feed_post = async (post_id: number): Promise<fetch_single_feed_post_return> => {
  const { data: p, error: pe } = await supabase.from(databases.forum_posts).select('*', { head: false }).eq('id', post_id).single();
  if (pe) { return { error: pe.message } }

  const { data: c, error: ce } = await supabase.from(databases.forum_comments).select('*', { head: false }).eq('post_id', post_id);
  if (ce) { return { error: ce.message } }

  const post: full_post_data = {
    post: p,
    comments: c.sort((a, b) => b.post_timestamp - a.post_timestamp),
    author_details: null,
  };

  return { data: post };
}

interface fetch_community_posts_return { error?: string; data?: community_post_data[] }
export const fetch_community_posts = async (token_slug: string): Promise<fetch_community_posts_return> => {
  const { data: cp, error: cpe } = await supabase.from(databases.community_posts).select('*').eq('token_slug', token_slug);
  if (cpe) {
    return {error: cpe.message};
  }

  return {data: cp};
}