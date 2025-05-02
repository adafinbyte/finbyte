/** @supabase */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** @blockfrost */
export const blockfrost_key = process.env.NEXT_PUBLIC_BLOCKFROST_KEY || '';

/** @discord */
export const discord_webhook_ping = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_PING || '';
