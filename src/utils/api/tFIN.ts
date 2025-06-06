import { get_timestamp } from "../common";
import { databases } from "../consts";
import { tfin_requests_data } from "../interfaces";
import { supabase } from "./secrets";

interface send_request_tfin_return { error?: string; requested?: boolean; }
export const send_request_tfin = async (
  wallet_address: string,
): Promise<send_request_tfin_return> => {
  const { data: rd } = await supabase
    .from(databases.tfin_requests)
    .select("*")
    .eq("address", wallet_address)
    .single();
  if (rd) { return { error: 'Wallet already requested.' } }
  
  const data = {
    address: wallet_address,
    requested_timestamp: get_timestamp()
  }

  const { error } = await supabase
    .from(databases.tfin_requests)
    .insert(data)
    .single();
  if (error) { return { error: error.message } }

  return { requested: true }
}

interface get_tfin_requests_return { error?: string; data?: tfin_requests_data[] }
export const get_tfin_requests = async (): Promise<get_tfin_requests_return> => {
  const { data: tr, error: tre } = await supabase.from(databases.tfin_requests).select('*');
  if (tre) { return { error: tre.message } }
  return { data: tr }
}