export default function OnboardingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Onboarding</p>
      <h1 className="mt-5 font-display text-6xl text-[var(--foreground)]">
        Capture target year, subjects, and weekly study capacity before adaptivity begins.
      </h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          "Target exam year",
          "Core subjects",
          "Weekly study capacity",
          "Target score",
        ].map((label) => (
          <div
            key={label}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5"
          >
            <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Stored in the `profiles` table and used to shape recommendations, pacing, and
              subject emphasis.
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
