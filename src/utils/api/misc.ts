import { format_unix } from "@/utils/string-tools";
import { databases } from "../consts";
import { discord_webhook_ping, supabase } from "../secrets";
import { finbyte_general_stats, platform_notification, platform_user, platform_user_details, safe_fetched_return } from "./interfaces";
import { notification_action_type, post_type } from "./types";
import { fetch_author_data } from "./account/fetch";

interface fetch_finbyte_general_stats_return { error?: string; data?: finbyte_general_stats }
export const fetch_finbyte_general_stats = async (): Promise<fetch_finbyte_general_stats_return> => {
  const { data, error } = await supabase.rpc('fetch_finbyte_general_stats');
  if (error) {
    console.error(error);
    return { error: error.message };
  }
  return { data: data[0] };
};

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
