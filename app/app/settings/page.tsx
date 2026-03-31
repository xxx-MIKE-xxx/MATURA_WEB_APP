export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Settings</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Profile, pacing, and integration settings.
        </h1>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          "Target exam year: 2026",
          "Weekly study capacity: 6 hours",
          "Primary subjects: Math, English, Polish",
        ].map((item) => (
          <div
            key={item}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5 text-sm leading-7 text-[var(--foreground)]"
          >
            {item}
          </div>
        ))}
      </section>
    </div>
  );
}
