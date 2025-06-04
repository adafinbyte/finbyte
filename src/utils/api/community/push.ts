import { databases } from "@/utils/consts";
import { supabase } from "../secrets";

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

  if (!existingRows) {
    const { error: insertError } = await supabase
      .from("Communities")
      .insert([
        {
          token_slug,
          highlighted: false,
          community_likers: [address],
        },
      ]);

    if (insertError) {
      console.error("Insert error:", insertError.message);
      return { error: insertError.message };
    }

    return { success: true, action: "inserted" };
  }

  const currentLikers: string[] = existingRows.community_likers || [];
  const addressExists: boolean = currentLikers.includes(address);

  const updatedLikers = addressExists
    ? currentLikers.filter((addr) => addr !== address)
    : [...currentLikers, address];

  const { error: updateError } = await supabase
    .from("Communities")
    .update({ community_likers: updatedLikers })
    .eq("id", existingRows.id);

  if (updateError) {
    console.error("Update error:", updateError.message);
    return { error: updateError.message };
  }

  return {
    success: true,
    action: addressExists ? "removed" : "added",
  };
}
