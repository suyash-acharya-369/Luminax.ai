import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const hasSupabase = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey));

export const supabase: SupabaseClient | null = hasSupabase && supabaseAnonKey
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;

export const supabaseAdmin: SupabaseClient | null = hasSupabase && supabaseServiceRoleKey
	? createClient(supabaseUrl, supabaseServiceRoleKey)
	: null;


