import { AuthPanel } from "@/components/auth-panel";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-[1400px] items-center gap-12 px-6 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Atlas Matura</p>
        <h1 className="mt-6 font-display text-6xl text-[var(--foreground)]">
          Pick up exactly where your review schedule left off.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-8 text-[var(--muted)]">
          This screen is wired for Supabase Auth. If the public project vars are not set, it
          still explains the setup and keeps the demo shell usable.
        </p>
      </div>
      <AuthPanel mode="login" />
    </main>
  );
}
