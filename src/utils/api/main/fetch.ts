import { post_with_comments, safe_fetched_return } from "../interfaces";

import { databases } from "../../consts";
import { supabase } from "../../secrets";

export const fetch_all_forum_posts_with_comments = async (): Promise<safe_fetched_return> => {
  const { data: p, error: pe } = await supabase.from(databases.forum_posts).select('*');
  if (pe) return { error: pe };

  const { data: c, error: ce } = await supabase.from(databases.forum_comments).select('*');
  if (ce) return { error: ce };

  const add_comments_to_posts: post_with_comments[] = p.map(post => ({
      post,
      comments: c.filter(comment => comment.post_id === post.id),
      sorted: post.updated_timestamp ?? post.timestamp,
    })
  ).sort((a, b) => b.sorted - a.sorted);

  return {data: add_comments_to_posts};
}

export const fetch_community_posts = async (token_slug: string): Promise<safe_fetched_return> => {
  const { data: cp, error: cpe } = await supabase.from(databases.community_posts).select('*').eq('token_slug', token_slug);
  if (cpe) {
    return {error: cpe.message};
  }

  return {data: cp};
}

export const fetch_forum_post_with_comments = async (post_id: number): Promise<safe_fetched_return> => {
  const { data: p, error: pe } = await supabase.from(databases.forum_posts).select('*', { head: false }).eq('id', post_id).single();
  if (pe) { return { error: pe.message } }

  const { data: c, error: ce } = await supabase.from(databases.forum_comments).select('*', { head: false }).eq('post_id', post_id);
  if (ce) { return { error: ce.message } }

  const post: post_with_comments = {
    post: p,
    comments: c.sort((a, b) => b.timestamp - a.timestamp)
  }

  return {data: post};
}
