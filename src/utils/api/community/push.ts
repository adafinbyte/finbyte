import { databases } from "@/utils/consts";
import { supabase } from "../secrets";
import { fetch_community_data } from "./fetch";

interface like_unlike_community_return { error?: string; success?: boolean; action?: string;  }
export const like_unlike_community = async (address: string, token_slug: string): Promise<like_unlike_community_return> => {
  const { data: existingRows, error: fetchError } = await supabase
    .from(databases.communities)
    .select("*")
    .eq("token_slug", token_slug)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Fetch error:", fetchError.message);
    return { error: fetchError.message };
  }

  const community = await fetch_community_data(token_slug);
  if (community.error) {
    return { error: community.error }
  }

  const currentLikers: string[] = existingRows.community_likers || [];
  const addressExists: boolean = currentLikers.includes(address);

  const updatedLikers = addressExists
    ? currentLikers.filter((addr) => addr !== address)
    : [...currentLikers, address];

  const { error: updateError } = await supabase
    .from(databases.communities)
    .update({ community_likers: updatedLikers })
    .eq("token_slug", token_slug);

  if (updateError) {
    console.error("Update error:", updateError.message);
    return { error: updateError.message };
  }

  return {
    success: true,
    action: addressExists ? "removed" : "added",
  };
}
