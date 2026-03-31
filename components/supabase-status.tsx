"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabaseClient, getSupabaseEnv } from "@/lib/supabase";

export function SupabaseStatus() {
  const env = getSupabaseEnv();
  const [status, setStatus] = useState(() =>
    env.configured
      ? "Checking connection..."
      : "Demo mode: public Supabase env vars are not set.",
  );

  useEffect(() => {
    if (!env.configured) {
      return;
    }

    const client = getBrowserSupabaseClient();

    if (!client) {
      return;
    }

    const supabase = client;

    async function check() {
      const { count, error } = await supabase
        .from("subjects")
        .select("*", { count: "exact", head: true });

      if (error) {
        setStatus("Supabase auth is ready, but the learning schema still needs to be applied.");
        return;
      }

      setStatus(`Supabase live: ${count ?? 0} seeded subject rows detected.`);
    }

    void check();
  }, [env.configured]);

  return (
    <div className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
      {status}
    </div>
  );
}
