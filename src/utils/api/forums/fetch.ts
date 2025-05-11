import { post_with_comments, safe_fetched_return } from "../interfaces";

import { databases } from "../../consts";
import { supabase } from "../../secrets";

export const fetch_all_forum_posts_with_comments = async (): Promise<safe_fetched_return> => {
  const { data: p, error: pe } = await supabase.from(databases.forum_posts).select('*');
  if (pe) return { error: pe };

  const { data: c, error: ce } = await supabase.from(databases.forum_comments).select('*');
  if (ce) return { error: ce };

  const request_post_ids = p.filter(post => post.section === 'requests').map(post => post.id);

  const { data: v, error: ve } = await supabase.from(databases.votes).select('*').in('post_id', request_post_ids);
  if (ve) return { error: ve };

  const fixed_posts_data: post_with_comments[] = p.map(post => {
    const post_votes = post.section === 'requests'
      ? v.filter(vote => vote.post_id === post.id)
      : null;

    return {
      post: post,
      comments: c.filter(comment => comment.post_id === post.id),
      sorted: post.updated_timestamp ?? post.timestamp,
      user: null,
      votes: post_votes
    };
  }).sort((a, b) => b.sorted - a.sorted);

  return {data: fixed_posts_data};
}

export const fetch_forum_post_with_comments = async (post_id: number): Promise<safe_fetched_return> => {
  const { data: p, error: pe } = await supabase.from(databases.forum_posts).select('*', { head: false }).eq('id', post_id).single();
  if (pe) { return { error: pe.message } }

  const { data: c, error: ce } = await supabase.from(databases.forum_comments).select('*', { head: false }).eq('post_id', post_id);
  if (ce) { return { error: ce.message } }

  let votes = null;
  if (p.section === 'requests') {
    const { data: v, error: ve } = await supabase
      .from(databases.votes)
      .select('*')
      .eq('post_id', post_id);
    if (ve) return { error: ve.message };
    votes = v;
  }

  const post: post_with_comments = {
    post: p,
    comments: c.sort((a, b) => b.timestamp - a.timestamp),
    user: null,
    votes: votes
  };

  return {data: post};
}

export const fetch_chat_posts = async (): Promise<safe_fetched_return> => {
  const { data: cp, error: cpe } = await supabase.from(databases.finbyte_chat).select('*');
  if (cpe) {
    return {error: cpe.message};
  }

  return {data: cp};
}
