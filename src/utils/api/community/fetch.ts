import { project_community_data } from "@/utils/interfaces";
import { supabase } from "../secrets";
import { databases } from "@/utils/consts";

interface fetch_community_data_return { error?: string; data?: project_community_data}
export const fetch_community_data = async (
  token_slug: string
): Promise<fetch_community_data_return> => {
  const slug = token_slug.toLowerCase();

  const { data, error } = await supabase
    .from(databases.communities)
    .select("*")
    .eq("token_slug", slug)
    .single();

  const { data: posts_data, error: posts_error } = await supabase
    .from(databases.community_posts)
    .select("*")
    .eq("token_slug", slug);

  if (error?.code === "PGRST116") {
    return { error: "NotFound" };
  }

  if (error) return { error: error.message };
  if (posts_error) return { error: posts_error.message };

  return {
    data: {
      id: data.id,
      token_slug: data.token_slug,
      community_likers: data.community_likers,
      highlighted: data.highlighted,
      posts: posts_data?.length ?? 0,
      visits: data.visits
    },
  };
};

export const ensure_community_exists = async (
  token_slug: string
): Promise<fetch_community_data_return> => {
  const slug = token_slug.toLowerCase();

  const result = await fetch_community_data(slug);

  if (result.data) return result;

  if (result.error === "NotFound") {
    const { data: posts_data } = await supabase
      .from(databases.community_posts)
      .select("*")
      .eq("token_slug", slug);

    const { data: newData, error: insertError } = await supabase
      .from(databases.communities)
      .insert({
        token_slug: slug,
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
        posts: posts_data?.length ?? 0,
        visits: 0
      },
    };
  }

  return result;
};

export const add_community_visitor = async (token_slug: string) => {
  const { data, error } = await supabase
    .from(databases.communities)
    .select("*")
    .eq("token_slug", token_slug)
    .single();

  if (error && error.code !== "PGRST116") {
    return { error: error.message}
  }

  const currentVisits = typeof data.visits === 'number' ? data.visits : 0;
  const { error: updateError } = await supabase
    .from(databases.communities)
    .update({ visits: currentVisits + 1 })
    .eq("token_slug", token_slug);

  if (updateError && updateError.code !== "PGRST116") {
    return { error: updateError.message}
  }
}