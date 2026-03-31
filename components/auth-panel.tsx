"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { getBrowserSupabaseClient, getSupabaseEnv } from "@/lib/supabase";

type AuthPanelProps = {
  mode: "login" | "signup";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const env = getSupabaseEnv();

  async function handleSubmit() {
    const supabase = getBrowserSupabaseClient();

    if (!supabase) {
      setStatus(
        "Supabase env vars are not configured yet. The preview still works in demo mode, but live auth needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
            emailRedirectTo: `${window.location.origin}/app`,
          },
        });

        if (error) {
          throw error;
        }

        setStatus("Account created. Check your inbox if email confirmation is enabled.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        setStatus("Signed in. Opening your study dashboard.");
        startTransition(() => {
          window.location.assign("/app");
        });
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMagicLink() {
    const supabase = getBrowserSupabaseClient();

    if (!supabase) {
      setStatus(
        "Live auth is unavailable until the public Supabase env vars are added to the project.",
      );
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        throw error;
      }

      setStatus("Magic link sent. Open the email from Supabase to continue.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not send magic link.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_30px_100px_rgba(27,45,67,0.08)] sm:p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
        {mode === "signup" ? "New learner" : "Welcome back"}
      </p>
      <h1 className="mt-3 font-display text-4xl text-[var(--foreground)]">
        {mode === "signup" ? "Create your study account" : "Log in to continue"}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
        Email/password and magic link flows are wired to Supabase Auth. If env vars
        are missing, the page gracefully stays in demo mode.
      </p>

      <div className="mt-8 grid gap-4">
        {mode === "signup" ? (
          <label className="grid gap-2 text-sm text-[var(--foreground)]">
            Display name
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--teal)]"
              placeholder="Aleksandra"
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm text-[var(--foreground)]">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--teal)]"
            placeholder="student@example.com"
            type="email"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--foreground)]">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--teal)]"
            placeholder="At least 8 characters"
            type="password"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Working..."
            : mode === "signup"
              ? "Create account"
              : "Log in"}
        </button>
        <button
          onClick={handleMagicLink}
          disabled={submitting || !email}
          className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--teal)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send magic link
        </button>
      </div>

      {status ? (
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
          {status}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
        <span>
          Supabase env:{" "}
          <strong className="text-[var(--foreground)]">
            {env.configured ? "configured" : "missing"}
          </strong>
        </span>
        <Link
          href={mode === "signup" ? "/login" : "/signup"}
          className="text-[var(--teal)] underline underline-offset-4"
        >
          {mode === "signup" ? "Already have an account?" : "Need an account?"}
        </Link>
      </div>
    </div>
  );
}
