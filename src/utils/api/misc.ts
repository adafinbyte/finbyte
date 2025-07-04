import { get_timestamp } from "../common";
import { databases } from "../consts";
import { finbyte_general_stats, platform_user_details } from "../interfaces";
import { notification } from "../types";
import { supabase } from "./secrets";

interface fetch_finbyte_general_stats_return { error?: string; data?: finbyte_general_stats }
export const fetch_finbyte_general_stats = async (): Promise<fetch_finbyte_general_stats_return> => {
  const { data, error } = await supabase.rpc('fetch_finbyte_general_stats');
  if (error) {
    console.error(error);
    return { error: error.message };
  }
  return { data: data[0] };
};

interface fetch_all_finbyte_users_return { error?: string; data?: platform_user_details[] }
export const fetch_all_finbyte_users = async (): Promise<fetch_all_finbyte_users_return> => {
  const { data, error } = await supabase
    .from(databases.accounts)
    .select("*");

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { data };
}

interface check_user_on_login_return { error?: string; data?: boolean }
/** @note a true return means the user exists, a false is a user has been created */
export const check_user_on_login = async (address: string): Promise<check_user_on_login_return> => {
  const { data: eu, error: eue } = await supabase
    .from(databases.accounts)
    .select("*")
    .eq("address", address)
    .single();

  if (eue && eue.code !== "PGRST116") {
    return { error: "Error checking wallet address: " + eue.message };
  }

  if (eu) {
    const noti = await create_notification('user:login', null, address);
    if (noti.error) { return { error: noti.error } }
    return { data: true };
  }

  const { count, error: countError } = await supabase
    .from(databases.accounts)
    .select('id', { count: 'exact', head: true });

  if (countError) {
    return { error: "Error counting users: " + countError.message };
  }

  if (typeof count !== 'number') {
    return { error: "Failed to retrieve user count." };
  }

  const badges = count < 25 ? ['beta'] : [];

  const { error: nue } = await supabase
    .from(databases.accounts)
    .insert({ address: address, badges: badges, f_timestamp: get_timestamp() })
    .select()
    .single();

  if (nue) {
    return { error: "Error creating new user: " + nue.message };
  }

  const noti = await create_notification('user:new', null, address);
  if (noti.error) { return { error: noti.error } }

  return { data: false };
};

interface create_notification_return { error?: string; done?: boolean; }
export const create_notification = async (
  action: notification,
  post_id: number | null,
  address: string,
): Promise<create_notification_return> => {
  const timestamp = get_timestamp();
  const data = {
    action,
    address,
    timestamp: timestamp,
    notification_timestamp: timestamp,
    forum_post_id: post_id
  }

  const { error } = await supabase
    .from(databases.notifications)
    .insert(data)
    .single();
  if (error) { return { error: error.message } }
  return { done: true }
};

/**
 * @todo
 * delete post
 */