import toast from "react-hot-toast";

import { account_data } from "../interfaces";
import { create_notification } from "../push";

import { databases } from "@/utils/consts";
import { supabase } from "@/utils/secrets";

export const create_user_account = async (
  account_data: account_data
): Promise<void> => {
  const { error } = await supabase
    .from(databases.accounts).insert(account_data).single();

  if (error) {
    toast.error("Failed to create account.");
    return;
  } else {
    toast.success("Account created successfully.");
    await create_notification('new-account', account_data.timestamp, account_data.address);
  }
};

export const update_username = async (
  address:         string,
  timestamp:       number,
  username_handle: string
) => {
  const { error } = await supabase
    .from(databases.accounts)
    .update({
        ra_timestamp: timestamp,
        ada_handle:   username_handle
      }
    )
    .eq('address', address);
  
  if (error) {
    toast.error(error.message);
  } else {
    await create_notification('updated-adahandle', timestamp, address);
    toast.success('Your username has been updated! Kudos.');
  }
}

export const update_representing_community = async (
  address:      string,
  timestamp:    number,
  token_ticker: string
) => {
  const { error } = await supabase
    .from(databases.accounts)
    .update({
        ra_timestamp:    timestamp,
        community_badge: token_ticker
      }
    )
    .eq('address', address);

  if (error) {
    toast.error(error.message);
  } else {
    await create_notification('updated-community-badge', timestamp, address);
    toast.success("Kudos! You're now representing this community!");
  }
}

