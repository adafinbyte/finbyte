/** @supabase */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yklrbdzsmoydcgcfupdx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbHJiZHpzbW95ZGNnY2Z1cGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MzMxMDYsImV4cCI6MjA1MzAwOTEwNn0.2TW1fh3ksAzt7wUNAzR2p85Rg7GP-qQg29JqsgkLYX0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** @blockfrost */
export const blockfrost_key = process.env.NEXT_PUBLIC_BLOCKFROST_KEY_PREPROD || 'preprodnHPrdBBwLNt2hJEWT6i8s2xrSOYYyyX5';

/** @discord */
export const discord_webhook_ping = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_PING || 'https://discord.com/api/webhooks/1367878121378025472/t6rYNNkQAr1RGhl_TduroEAoR5CY4xLxRJ6k4vIscDTqeRyIEqFT-jRDWsjLNRZTBXLy';