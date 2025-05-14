import { databases } from "../consts";
import { discord_webhook_ping, supabase } from "../secrets";
import { format_unix } from "../string-tools";
import { post_type } from "../types";
import { platform_notification } from "./interfaces";

interface create_notification_return { error?: string; created?: boolean; }
export const create_notification = async (
  title: string,
  address: string,
  timestamp: number,
  forum_post_id: number | null,
  token_slug: string | null,
  post_type: post_type
): Promise<create_notification_return> => {
  /** sort the data to the interface */
  const data: platform_notification = {
    action: title,
    address: address,
    timestamp: timestamp,
    forum_post_id: forum_post_id,
    token_slug: token_slug
  }

  /** push the data */
  const { error } = await supabase
    .from(databases.notifications)
    .insert([data])
    .single();

  /** toast the error */
  if (error) return { error: error.message }

  try {
    /** this is more env stuff, we should already have it */
    if (!discord_webhook_ping) return { error: 'Discord webhook URL is not set'}

    /** create external strings matching the post type */
    const forum_post_url = 'https://finbyte.vercel.app/forums/' + forum_post_id;
    const community_post_url = 'https://finbyte.vercel.app/tokens/' + token_slug;
    const extended_webhook_string = `
    ${post_type === 'forum_post' || post_type === 'forum_comment' ? forum_post_url : ''}
    ${post_type === 'community_post' ? community_post_url : ''}
    `

    /** make it look nice for discord */
    const discord_post_text = `
:bell: **${title}**
:bust_in_silhouette: *${address.substring(0, 10) + '...' + address.substring(address.length - 10)}*
:clock: *${format_unix(timestamp).date}*
${title.toLowerCase().includes('delete') ? '' : extended_webhook_string}
    `;

    /** push the webhook */
    await fetch(discord_webhook_ping, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: discord_post_text
      }),
    });
    return { created: true}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error'}
  }
}