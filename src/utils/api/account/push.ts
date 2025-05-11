import { supabase } from "@/utils/secrets";
import { account_data, safe_fetched_return } from "../interfaces";
import { databases } from "@/utils/consts";
import { create_notification } from "../misc";
import { notification_action_type } from "../types";

export const create_user_account = async (
  account_data: account_data
): Promise<safe_fetched_return | void> => {
  const { error } = await supabase
    .from(databases.accounts).insert(account_data).single();

  if (error) {
    return {error: error.message};
  } else {
    await create_notification(
      account_data.f_timestamp,
      account_data.address,
      'New Account',
      null,
      {forum_post_id: null, token_slug: null}
    );
  }
};

export const delete_account = async (
  address: string,
  timestamp: number,
): Promise<safe_fetched_return | void> => {

  const noti_type: notification_action_type = 'Account Deleted';

  const { error } = await supabase
    .from(databases.accounts)
    .delete()
    .eq('address', address)
    .single();

  if (error) {
    return { error: error.message }
  } else {
    await create_notification(
      timestamp,
      address,
      noti_type,
      null,
      {forum_post_id: null, token_slug: null}
    );
    return;
  }
}

export const update_username = async (
  address:         string,
  timestamp:       number,
  ada_handle: string
): Promise<safe_fetched_return | void> => {
  const { error } = await supabase
    .from(databases.accounts)
    .update({
        l_timestamp: timestamp,
        ada_handle:   ada_handle
      }
    )
    .eq('address', address);
  
  if (error) {
    return { error: error.message }
  } else {
    await create_notification(
      timestamp,
      address,
      'Updated AdaHandle',
      null,
      {forum_post_id: null, token_slug: null}
    );
  }
}

export const update_community_badge = async (
  address:      string,
  timestamp:    number,
  token_ticker: string
): Promise<safe_fetched_return | void> => {
  const { error } = await supabase
    .from(databases.accounts)
    .update({
        l_timestamp:    timestamp,
        community_badge: token_ticker
      }
    )
    .eq('address', address);

  if (error) {
    return { error: error.message }
  } else {
    await create_notification(
      timestamp,
      address,
      'Updated Community Badge',
      null,
      {forum_post_id: null, token_slug: null}
    );
  }
}