import { getAnalyticsSnapshot } from "@/lib/matura-data";

export default function AnalyticsPage() {
  const analytics = getAnalyticsSnapshot();

  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Analytics</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Track readiness by subject, weakness pattern, and review delay.
        </h1>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {Object.entries(analytics.subjectSeries).map(([subjectCode, series]) => (
          <article
            key={subjectCode}
            className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              {subjectCode}
            </p>
            <div className="mt-5 grid gap-3">
              {series.map((point) => (
                <div key={point.label}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[var(--muted)]">{point.label}</span>
                    <span className="font-semibold text-[var(--foreground)]">{point.value}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--surface)]">
                    <div
                      className="h-full rounded-full bg-[var(--teal)]"
                      style={{ width: `${point.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
