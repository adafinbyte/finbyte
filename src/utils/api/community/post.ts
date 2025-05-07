import { supabase } from "@/utils/secrets";
import { safe_fetched_return } from "../interfaces";
import { databases } from "@/utils/consts";

export const add_project_like = async (
  token_slug: string,
  user_address: string
): Promise<safe_fetched_return | void> => {
  const { data: community, error: fetchError } = await supabase
    .from(databases.communities)
    .select('*')
    .eq('token_slug', token_slug)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { error: fetchError.message };
  }

  if (community) {
    const currentLikers: string[] = community.community_likers || [];
    const alreadyLiked = currentLikers.includes(user_address);
    const updatedLikers = alreadyLiked
      ? currentLikers.filter(addr => addr !== user_address)
      : [...currentLikers, user_address];

    const { error: updateError } = await supabase
      .from(databases.communities)
      .update({ community_likers: updatedLikers })
      .eq('token_slug', token_slug)
      .single();

    if (updateError) return { error: updateError.message };
  } else {
    const { error: insertError } = await supabase
      .from(databases.communities)
      .insert({
        token_slug,
        community_likers: [user_address]
      });

    if (insertError) return { error: insertError.message };
  }
};

