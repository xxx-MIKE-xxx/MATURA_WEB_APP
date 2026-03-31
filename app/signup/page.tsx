import { AuthPanel } from "@/components/auth-panel";

export default function SignupPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-[1400px] items-center gap-12 px-6 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Onboarding</p>
        <h1 className="mt-6 font-display text-6xl text-[var(--foreground)]">
          Create a learner profile for the exact exam path you are targeting.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-8 text-[var(--muted)]">
          The account record is designed to feed target year, subject mix, weekly capacity,
          and future diagnostic results into the adaptive session planner.
        </p>
      </div>
      <AuthPanel mode="signup" />
    </main>
  );
}
