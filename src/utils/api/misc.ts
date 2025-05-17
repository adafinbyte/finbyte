import { format_unix } from "@/utils/string-tools";
import { databases } from "../consts";
import { discord_webhook_ping, supabase } from "../secrets";
import { platform_notification, platform_user, platform_user_details, safe_fetched_return } from "./interfaces";
import { notification_action_type, post_type } from "./types";
import { fetch_author_data } from "./account/fetch";

export const fetch_finbyte_general_stats = async (): Promise<safe_fetched_return> => {
  const unique_users = new Set<string>();
  const users = new Map<string, platform_user_details>();
  let platform_tips = 0;
  let likes_given = 0;

  const { data: p, error: pe } = await supabase.from(databases.forum_posts).select('*');
  if (pe) return { error: pe };

  const { data: c, error: ce } = await supabase.from(databases.forum_comments).select('*');
  if (ce) return { error: ce };

  const { data: cp, error: cpe } = await supabase.from(databases.community_posts).select('*');
  if (cpe) return { error: cpe };

  const { data: fc, error: fce } = await supabase.from(databases.finbyte_chat).select('*');
  if (fce) return { error: fce };

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

  fc.forEach(post => {
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
  });

  await Promise.all(Array.from(unique_users).map(async (address) => {
    /** @todo this will f us in the future if the users grow too much, paginate this. */
    const user_data = await fetch_author_data(address);
    users.set(address, user_data.data);
  }));

  return {
    data: {
      forum_posts: p.length,
      forum_comments: c.length,
      community_posts: cp.length,
      finbyte_chats: fc.length,
      total_posts: p.length + c.length + cp.length,
      total_tips: platform_tips,
      likes_given,
      unique_users: unique_users.size,
      users: Array.from(users.values()) as platform_user_details[],
      interactions: i.length,
    }
  };
}

export const create_notification = async (
  timestamp: number,
  address:   string,
  action: notification_action_type,
  post_type: post_type | null,
  page_id: { forum_post_id: number | null, token_slug: string | null }
): Promise<safe_fetched_return | void> => {
  const data: platform_notification = {
    action: action,
    address: address,
    timestamp: timestamp,
    forum_post_id: page_id.forum_post_id,
    token_slug: page_id.token_slug
  }

  const { error } = await supabase
    .from(databases.notifications)
    .insert([data])
    .single();

  if (error) return { error: error.message }

  try {
    if (!discord_webhook_ping) return { error: 'Discord webhook URL is not set'}

    const forum_post_url = 'https://finbyte.vercel.app/forums/' + page_id.forum_post_id;
    const community_post_url = post_type === 'community_post' ?
      'https://finbyte.vercel.app/tokens/' + page_id.token_slug : null;

    const forum_post_string = `:speech_balloon: ${forum_post_url}`;
    const community_post_string = `:speech_balloon: ${community_post_url}`;
    const is_forum_post = (post_type === 'forum_post' || post_type === 'forum_comment') ? true : false;
    const is_community_post = post_type === 'community_post' ? true : false;

    const discord_post_text = `
:bell: **${action}**
:bust_in_silhouette: *${address.substring(0, 10) + '...' + address.substring(address.length - 10)}*
:clock: *${format_unix(timestamp).date}*
${action.startsWith('Del') ? '' : is_community_post ? community_post_string : is_forum_post ? forum_post_string : ''}
    `;

    await fetch(discord_webhook_ping, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: discord_post_text
      }),
    });
  } catch (err) {
    console.error("Failed to send Discord webhook:", err);
  }
}
