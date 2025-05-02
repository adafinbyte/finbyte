import toast from "react-hot-toast";

import { fetched_chat_post_data, platform_interaction, platform_user, post_with_comments } from "./interfaces";

import { databases } from "../consts";
import { supabase } from "../secrets";

export const fetch_all_forum_posts_with_comments = async (): Promise<post_with_comments[] | null> => {
  const { data: p, error: pe } = await supabase
    .from(databases.forum_posts)
    .select('*');

  if (pe) {
    toast.error(pe.message);
    return null;
  }

  const { data: c, error: ce } = await supabase
    .from(databases.forum_comments)
    .select('*');

  if (ce) {
    toast.error(ce.message);
    return null;
  }

  const add_comments_to_posts: post_with_comments[] = p.map(post => ({
      post,
      comments: c.filter(comment => comment.post_id === post.id),
      sorted: post.updated_timestamp ?? post.timestamp,
    })
  ).sort((a, b) => b.sorted - a.sorted);

  return add_comments_to_posts;
}

export const fetch_forum_post_with_comments = async (post_id: number): Promise<post_with_comments | null> => {
  const { data: p, error: pe } = await supabase
    .from(databases.forum_posts)
    .select('*', { head: false })
    .eq('id', post_id)
    .single();

  if (pe) {
    toast.error(pe.message);
    return null;
  }

  const { data: c, error: ce } = await supabase
    .from(databases.forum_comments)
    .select('*', { head: false })
    .eq('post_id', post_id);

  if (ce) {
    toast.error(ce.message);
    return null;
  }

  const post: post_with_comments = {
    post: p,
    comments: c.sort((a, b) => b.timestamp - a.timestamp)
  }

  return post;
}

export const fetch_community_posts = async (token_slug: string) => {
  const { data: cp, error: cpe } = await supabase
    .from(databases.community_posts)
    .select('*')
    .eq('token_slug', token_slug);

  if (cpe) {
    toast.error(cpe.message);
    return null;
  }

  return cp;
}

export const fetch_chats = async (): Promise<fetched_chat_post_data[] | null> => {
  const { data: c, error: ce } = await supabase
    .from(databases.chat)
    .select('*');

  if (ce) {
    toast.error(ce.message);
    return null;
  }

  return c;
}

export const fetch_platform_interactions = async (limit?: number | undefined): Promise<platform_interaction[] | null> => {
  const { data: n, error: ne } = await supabase
    .from(databases.notifications)
    .select('*', { head: false })
    .order('timestamp', { ascending: false })
    .limit(limit ? limit : 100);

  if (ne) {
    toast.error(ne.message);
    return null;
  }

  return n;
}

export const fetch_everything_count = async () => {
  const unique_users = new Set<string>();
  const users = new Map<string, platform_user>();
  let platform_tips = 0;
  let likes_given = 0;

  const { data: p, error: pe } = await supabase
    .from(databases.forum_posts)
    .select('*');

  if (pe) {
    toast.error(pe.message);
    return null;
  }

  const { data: c, error: ce } = await supabase
    .from(databases.forum_comments)
    .select('*');

  if (ce) {
    toast.error(ce.message);
    return null;
  }

  const { data: cp, error: cpe } = await supabase
    .from(databases.community_posts)
    .select('*');

  if (cpe) {
    toast.error(cpe.message);
    return null;
  }

  const { data: i, error: ie } = await supabase
    .from(databases.notifications)
    .select('*');

  if (ie) {
    toast.error(ie.message);
    return null;
  }

  p.forEach(post => {
    unique_users.add(post.author);
    platform_tips += post.tip_tx_hashes?.length ?? 0;
    likes_given += post.post_likers?.length ?? 0;

    if (Array.isArray(post.post_likers)) {
      post.post_likers.forEach((liker: string) => {
        unique_users.add(liker);
      });
    }
  })

  c.forEach(comment => {
    unique_users.add(comment.author);
    platform_tips += comment.tip_tx_hashes?.length ?? 0;
    likes_given += comment.post_likers?.length ?? 0;

    if (Array.isArray(comment.post_likers)) {
      comment.post_likers.forEach((liker: string) => {
        unique_users.add(liker);
      });
    }
  })

  cp.forEach(post => {
    unique_users.add(post.author);
    platform_tips += post.tip_tx_hashes?.length ?? 0;
    likes_given += post.post_likers?.length ?? 0;

    if (Array.isArray(post.post_likers)) {
      post.post_likers.forEach((liker: string) => {
        unique_users.add(liker);
      });
    }
  })

  i.forEach(interaction => {
    const address = interaction.address;
    unique_users.add(address);
    
    if (!users.has(address)) {
      users.set(address, {
        type: interaction.action === 'new-account' ? 'finbyte' : 'anon',
        address
      });
    }
  });

  const data = {
    forum_posts: p.length,
    forum_comments: c.length,
    community_posts: cp.length,
    total_posts: p.length + c.length + cp.length,
    total_tips: platform_tips,
    likes_given: likes_given,

    unique_users: unique_users.size,
    users: Array.from(users.values()),
    interactions: i.length
  }

  return data;
}
