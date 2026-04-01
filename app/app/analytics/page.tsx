import { PageHero } from "@/components/page-hero";
import { ReadinessCard } from "@/components/readiness-card";
import { getAnalyticsSnapshot } from "@/lib/matura-data";

export default function AnalyticsPage() {
  const analytics = getAnalyticsSnapshot();
  const overall = analytics.overall;

  return (
    <div className="grid gap-6 lg:gap-8">
      <PageHero
        eyebrow="Analytics"
        title="Readiness should feel measurable: score band, confidence, workload, and where your points are still leaking."
        description="Start with the summary, then drill into each subject. This view prioritizes what changes your next score, not just what looks busy."
        aside={
          <div className="rounded-[30px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,229,215,0.86))] p-5 shadow-[var(--panel-shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
              Overall signal
            </p>
            <p className="mt-3 font-display text-5xl text-[var(--foreground)]">
              {overall.predictedScore}%
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Expected range {overall.rangeLow}-{overall.rangeHigh}% •{" "}
              {overall.confidenceLabel.toLowerCase()}
            </p>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Overall readiness",
            value: `${overall.readiness}%`,
            detail: `Predicted score band ${overall.rangeLow}-${overall.rangeHigh}%`,
          },
          {
            label: "Review completion",
            value: `${overall.reviewCompletionRate}%`,
            detail: `${overall.dueReviews} reviews due right now`,
          },
          {
            label: "Study time",
            value: `${overall.studyHours}h`,
            detail: `Current streak ${overall.streak} days`,
          },
          {
            label: "Consistency",
            value: `${overall.consistency}%`,
            detail: `Average accuracy ${overall.accuracy}%`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[26px] border border-[var(--line-strong)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--panel-shadow-soft)]"
          >
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted-strong)]">
              {item.label}
            </p>
            <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
              {item.value}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {analytics.subjectInsights.map((insight) => (
          <ReadinessCard key={insight.code} insight={insight} />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                Trend over time
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                Average score movement
              </h2>
            </div>
            <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
              Last 5 checkpoints
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {analytics.scoreHistory.map((point) => (
              <div key={point.label}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[var(--muted)]">{point.label}</span>
                  <span className="font-semibold text-[var(--foreground)]">{point.value}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-[var(--surface)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--teal),var(--navy))]"
                    style={{ width: `${point.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            Task distribution
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            Practice mix
          </h2>
          <div className="mt-6 grid gap-4">
            {analytics.taskMix.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[var(--muted)]">{item.label}</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {item.count} tasks • {item.share}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-[var(--surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--coral)]"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {analytics.subjectInsights.map((insight) => (
          <article
            key={`${insight.code}-detail`}
            id={insight.code}
            className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                  {insight.name}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                  Breakdown
                </h2>
              </div>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{
                  backgroundColor: insight.accentSoft,
                  color: insight.accent,
                }}
              >
                {insight.confidenceLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Accuracy", `${insight.accuracy}%`],
                ["Avg speed", `${insight.avgResponseTimeSec}s`],
                ["Hint usage", `${insight.hintDependency}%`],
                ["Calibration", `${insight.calibration}%`],
                ["Completion", `${insight.reviewCompletionRate}%`],
                ["Study time", `${insight.studyHours}h`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] bg-[var(--surface)] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[22px] border border-[var(--line)] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                Weakest concept
              </p>
              <p className="mt-2 font-semibold text-[var(--foreground)]">
                {insight.weakestConcept.name}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {insight.weakestConcept.errorTrend}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            Overdue load
          </p>
          <div className="mt-5 grid gap-3">
            {analytics.mostDelayed.map((concept) => (
              <div key={concept.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{concept.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{concept.topic}</p>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--warning)]">
                    Due
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            Best performers
          </p>
          <div className="mt-5 grid gap-3">
            {analytics.strongestSubjects.map((subject) => (
              <div key={subject.code} className="rounded-[22px] border border-[var(--line)] px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-[var(--foreground)]">{subject.name}</p>
                  <span className="text-xl font-semibold text-[var(--foreground)]">
                    {subject.readiness}%
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {subject.focusDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
