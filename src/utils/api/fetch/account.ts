import { supabase } from "@/utils/secrets";
import { chat_post_data, finbyte_account_data, platform_user_details } from "../interfaces";
import { number } from "motion";
import { databases } from "@/utils/consts";


interface fetch_platform_user_details_return { error?: string; data?: platform_user_details }
export const fetch_platform_user_details = async (
  author: string
): Promise <fetch_platform_user_details_return> => {
  /** init */
  let finbyte_chats: chat_post_data[] = [];
  let first_timestamp: string | number = 0;
  let all_timestamps: string[] = [];
  let finbyte_kudos: number = 0;
  let account_data: finbyte_account_data | null = null;

  /** get data */
  const { data, error } = await supabase.rpc('search_author', { author_query: author });

  /** will toast the error */
  if (error) {
    return { error: error.message }
  }

  if (data) {
    /** forum post ids shouldn't appear twice */
    const forum_post_ids = new Set<number>();

    /** sort data */
    data.forEach((row: any) => {
      const postTimestamp = row.post_timestamp?.toString() || '';
      if (row.db === databases.finbyte_chat) {
        finbyte_chats.push({ ...row, type: 'finbyte_chat' });
        all_timestamps.push(postTimestamp);
        finbyte_kudos += 1;
        finbyte_kudos += (row.post_likers?.length ?? 0) * 2;
        finbyte_kudos += (row.tip_tx_hashes?.length ?? 0) * 3;
      }
    });

    /** find first known timestamp */
    first_timestamp = all_timestamps.reduce((min, timestamp) => {
      return new Date(timestamp) < new Date(min) ? timestamp : min;
    }, all_timestamps[0] || new Date().toISOString());

    /** merge all posts as count */
    const total_posts = finbyte_chats.length;

    /** get registered finbyte data, its okay not to return error here */
    const { data: ad } = await supabase
      .from(databases.accounts).select('*').eq('address', author).single();
    if (ad) {
      account_data = ad;
    }

    /** sort the data to the interface */
    const platform_details: platform_user_details = {
      finbyte_chats,
      first_timestamp: Number(first_timestamp),
      total_posts,
      finbyte_kudos,
      account_data: account_data,
      ada_handle: account_data?.ada_handle ? account_data.ada_handle : null,
      type: account_data?.address ? 'finbyte' : 'anon',
      address: author
    };

    return { data: platform_details }
  }

  return {};
}

