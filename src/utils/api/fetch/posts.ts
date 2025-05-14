import { databases } from "@/utils/consts";
import { supabase } from "@/utils/secrets";
import { chat_post_data } from "../interfaces";

interface fetch_chat_post_return {error?: string, data?: chat_post_data[]}

/** @note use page = 0 for everything */
export const fetch_chat_posts = async (
  page: number
): Promise<fetch_chat_post_return> => {
  const start = (page - 1) * 10;
  const end = start + 10 - 1;

  if (page === 0) {
    const { data: cp, error: cpe } = await supabase.from(databases.finbyte_chat).select('*');

    if (cpe) {
      return { error: cpe.message };
    }

    return { data: cp };
  } else {
    const { data: cp, error: cpe } = await supabase.from(databases.finbyte_chat).select('*').range(start, end);

    if (cpe) {
      return { error: cpe.message };
    }

    return { data: cp };
  }
};
