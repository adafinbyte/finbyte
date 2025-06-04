import { project_community_data } from "@/utils/interfaces";
import { supabase } from "../secrets";
import { databases } from "@/utils/consts";

interface fetch_community_data_return { error?: string; data?: project_community_data}

export const fetch_community_data = async (
  token_slug: string
): Promise<fetch_community_data_return> => {
  const { data, error } = await supabase
    .from(databases.communities)
    .select("*")
    .eq("token_slug", token_slug)
    .single();

  if (error && error.code !== "PGRST116") {
    return { error: error.message };
  }

  if (data) {
    return {
      data: {
        id: data.id,
        token_slug: data.token_slug,
        community_likers: data.community_likers,
        highlighted: data.highlighted,
      },
    };
  }

  const { data: newData, error: insertError } = await supabase
    .from(databases.communities)
    .insert({
      token_slug,
      highlighted: false,
      community_likers: [],
    })
    .select()
    .single();

  if (insertError) return { error: insertError.message };

  return {
    data: {
      id: newData.id,
      token_slug: newData.token_slug,
      community_likers: newData.community_likers,
      highlighted: newData.highlighted,
    },
  };
};