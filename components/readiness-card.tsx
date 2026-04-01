import Link from "next/link";
import type { SubjectInsight } from "@/lib/matura-data";

type ReadinessCardProps = {
  insight: SubjectInsight;
  href?: string;
  emphasis?: "default" | "strong";
};

export function ReadinessCard({
  insight,
  href,
  emphasis = "default",
}: ReadinessCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            {insight.name}
          </p>
          <h3 className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
            {insight.predictedScore}%
          </h3>
        </div>
        <div
          className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]"
          style={{
            backgroundColor: insight.accentSoft,
            color: insight.accent,
          }}
        >
          {insight.confidenceLabel}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-strong)]">
        <span className="rounded-full bg-black/5 px-3 py-1">
          Range {insight.rangeLow}-{insight.rangeHigh}%
        </span>
        <span className="rounded-full bg-black/5 px-3 py-1">
          Trend {insight.trend >= 0 ? "+" : ""}
          {insight.trend} pts
        </span>
        <span className="rounded-full bg-black/5 px-3 py-1">
          {insight.urgentConceptCount} urgent concepts
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{insight.bestNextStep}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
            Readiness
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            {insight.readiness}%
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
            Accuracy
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            {insight.accuracy}%
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
            Reviews due
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            {insight.dueReviews}
          </p>
        </div>
      </div>

      <div className="mt-6 h-2.5 rounded-full bg-black/8">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${insight.predictedScore}%`,
            backgroundColor: insight.accent,
          }}
        />
      </div>
    </>
  );

  const className =
    emphasis === "strong"
      ? "group overflow-hidden rounded-[30px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,249,240,0.98))] p-6 shadow-[var(--panel-shadow)] transition duration-200 hover:-translate-y-1 hover:border-[var(--line-emphasis)] hover:shadow-[var(--panel-shadow-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]/40"
      : "group overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[var(--panel-shadow-soft)] transition duration-200 hover:-translate-y-1 hover:border-[var(--line-emphasis)] hover:shadow-[var(--panel-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]/40";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}
