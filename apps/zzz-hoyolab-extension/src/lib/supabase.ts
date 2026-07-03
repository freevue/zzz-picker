import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getConfig() {
  const url = import.meta.env.WXT_SUPABASE_URL;
  const anonKey = import.meta.env.WXT_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

/** Supabase 클라이언트. 모노레포 packages/supabase와 무관한 독립 구현. */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const config = getConfig();
  if (!config) return null;

  client = createClient(config.url, config.anonKey);
  return client;
}

export function isSupabaseConfigured(): boolean {
  return getConfig() !== null;
}
