import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ServerSupabaseOptions = {
  accessToken?: string | null;
  serviceRole?: boolean;
};

function getServerSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    url,
    anonKey,
    serviceRoleKey,
    configured: Boolean(url && anonKey),
    serviceConfigured: Boolean(url && serviceRoleKey),
  };
}

export async function getServerSupabase(
  options: ServerSupabaseOptions = {},
): Promise<SupabaseClient> {
  const env = getServerSupabaseEnv();

  if (!env.url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for server-side physics access.");
  }

  const key = options.serviceRole ? env.serviceRoleKey : env.anonKey;

  if (!key) {
    throw new Error(
      options.serviceRole
        ? "SUPABASE_SERVICE_ROLE_KEY is required for privileged server-side physics access."
        : "NEXT_PUBLIC_SUPABASE_ANON_KEY is required for server-side Supabase access.",
    );
  }

  const headers: Record<string, string> = {};

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  return createClient(env.url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers,
    },
  });
}

export async function verifySupabaseAccessToken(accessToken: string) {
  const supabase = await getServerSupabase({ accessToken });
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function isServerSupabaseReady(options: ServerSupabaseOptions = {}) {
  const env = getServerSupabaseEnv();
  return options.serviceRole ? env.serviceConfigured : env.configured;
}
