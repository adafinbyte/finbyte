import { databases } from "../../consts";
import { supabase } from "../../secrets";
import { platform_user, safe_fetched_return } from "../interfaces";

export const fetch_finbyte_general_stats = async (): Promise<safe_fetched_return> => {
  const unique_users = new Set<string>();
  const users = new Map<string, platform_user>();
  let platform_tips = 0;
  let likes_given = 0;

  const { data: p, error: pe } = await supabase.from(databases.forum_posts).select('*');
  if (pe) return { error: pe };

  const { data: c, error: ce } = await supabase.from(databases.forum_comments).select('*');
  if (ce) return { error: ce };

  const { data: cp, error: cpe } = await supabase.from(databases.community_posts).select('*');
  if (cpe) return { error: cpe };

  const { data: i, error: ie } = await supabase.from(databases.notifications).select('*');
  if (ie) return { error: ie };

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

  return {
    data: {
      forum_posts: p.length,
      forum_comments: c.length,
      community_posts: cp.length,
      total_posts: p.length + c.length + cp.length,
      total_tips: platform_tips,
      likes_given,
      unique_users: unique_users.size,
      users: Array.from(users.values()),
      interactions: i.length,
    }
  };
}