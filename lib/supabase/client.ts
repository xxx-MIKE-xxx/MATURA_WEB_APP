import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    url,
    anonKey,
    siteUrl,
    configured: Boolean(url && anonKey),
  };
}

export function getBrowserSupabaseClient() {
  if (typeof window === "undefined") {
    return null;
  }

  const env = getSupabaseEnv();

  if (!env.configured || !env.url || !env.anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(env.url, env.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
