import { databases } from "@/utils/consts";
import { supabase } from "@/utils/secrets";
import { safe_fetched_return } from "../interfaces";

export const fetch_community_posts = async (token_slug: string): Promise<safe_fetched_return> => {
  const { data: cp, error: cpe } = await supabase.from(databases.community_posts).select('*').eq('token_slug', token_slug);
  if (cpe) {
    return {error: cpe.message};
  }

  return {data: cp};
}
