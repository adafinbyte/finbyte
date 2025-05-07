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