import Link from "next/link";
import { SupabaseStatus } from "@/components/supabase-status";
import { getDashboardSnapshot } from "@/lib/matura-data";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted-strong)]">
      {children}
    </p>
  );
}

function MetricTile({
  label,
  value,
  tone = "default",
  subtitle,
}: {
  label: string;
  value: string | number;
  tone?: "default" | "warning" | "success";
  subtitle?: string;
}) {
  const valueClass =
    tone === "warning"
      ? "text-[var(--warning)]"
      : tone === "success"
        ? "text-[var(--teal)]"
        : "text-[var(--foreground)]";

  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 shadow-[var(--panel-shadow-soft)] backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</p>
      {subtitle ? (
        <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}


function SubjectOverviewCard({
  insight,
}: {
  insight: ReturnType<typeof getDashboardSnapshot>["subjectInsights"][number];
}) {
  const trendUp = insight.trend >= 0;
  const trendLabel = trendUp ? `+${insight.trend}` : `${insight.trend}`;

  return (
    <Link
      href={`/app/study/session/${insight.code}?subject=${insight.code}&mode=practice&count=4`}
      className="group overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[var(--panel-shadow-soft)] transition duration-200 hover:-translate-y-[1px] hover:border-[var(--line-strong)] hover:shadow-[0_28px_64px_rgba(27,45,67,0.12)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: insight.accent }}
          >
            {insight.shortName}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {insight.name}
          </h3>
        </div>

        <div
          className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{
            color: insight.accent,
            backgroundColor: insight.accentSoft,
          }}
        >
          {trendLabel}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MetricTile label="Score" value={`${insight.predictedScore}%`} />
        <MetricTile label="Ready" value={`${insight.readiness}%`} />
        <MetricTile
          label="Due"
          value={insight.dueReviews}
          tone={insight.dueReviews > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            Biggest focus
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            {insight.weakestConcept.name} · {insight.weakestConcept.errorTrend}
          </p>
        </div>

        <div className="rounded-[20px] bg-[var(--surface)] px-4 py-3">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Best next step
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            {insight.bestNextStep}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-[var(--muted)]">
          Band {insight.rangeLow}-{insight.rangeHigh}%
        </span>
        <span
          className="text-sm font-semibold transition-opacity group-hover:opacity-80"
          style={{ color: insight.accent }}
        >
          Open subject →
        </span>
      </div>
    </Link>
  );
}

function QueueItem({
  title,
  meta,
  badge,
}: {
  title: string;
  meta: string;
  badge: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 shadow-[var(--panel-shadow-soft)]">
      <div>
        <p className="font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{meta}</p>
      </div>
      <span className="rounded-full bg-[var(--warning-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--warning)]">
        {badge}
      </span>
    </div>
  );
}

function SecondaryInsightCard({
  label,
  title,
  children,
  action,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            {title}
          </h2>
        </div>
        {action}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const snapshot = getDashboardSnapshot();
  const overall = snapshot.overall;
  const recommendedTasks = snapshot.recommended.tasks.slice(0, 3);

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:gap-8">
        {/* HERO: one screen = one primary action */}
        <section className="overflow-hidden rounded-[36px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,242,233,0.95))] shadow-[var(--panel-shadow)]">
        <div className="grid gap-0 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="p-7 sm:p-8 lg:p-10">
            <SectionLabel>Today</SectionLabel>

            <div className="mt-4 max-w-4xl">
              <h1 className="text-4xl font-semibold leading-[0.96] text-[var(--foreground)] sm:text-5xl lg:text-[76px]">
                Study the right thing today.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {snapshot.countdownDays} days until Matura. Clear what is due,
                protect easy points, and spend your best focus on the one block
                most likely to move your score.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile label="Predicted score" value={`${overall.predictedScore}%`} />
              <MetricTile label="Ready now" value={`${overall.readiness}%`} tone="success" />
              <MetricTile label="Due today" value={overall.dueReviews} tone="warning" />
              <MetricTile label="Predicted band" value={`${overall.rangeLow}-${overall.rangeHigh}%`} />
            </div>

            <div className="mt-8 rounded-[30px] border border-[var(--line)] bg-white/76 p-5 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <SectionLabel>Primary action</SectionLabel>
                  <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
                    {snapshot.recommended.subject.name} {snapshot.recommended.mode}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                    {snapshot.nextAction}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/app/study/session/recommended?subject=math&mode=practice&count=4"
                    className="app-button-primary"
                  >
                    Start today&apos;s block
                  </Link>
                  <Link href="/app/review" className="app-button-secondary">
                    Clear due reviews
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {recommendedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--foreground)]">
                          {task.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                          {task.reasons.join(" • ")}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[var(--teal-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
                        {task.estimatedTimeSec}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right rail: compact status, not competing with primary action */}
          <aside className="border-t border-[var(--line)] bg-[var(--shell)] p-6 sm:p-7 xl:border-l xl:border-t-0">
            <SectionLabel>Exam snapshot</SectionLabel>

            <div className="mt-4 rounded-[28px] border border-[var(--line)] bg-white/76 p-5">
              <p className="text-5xl font-semibold tracking-tight text-[var(--foreground)]">
                {overall.predictedScore}%
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Predicted band {overall.rangeLow}-{overall.rangeHigh}% •{" "}
                {overall.confidenceLabel.toLowerCase()}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <MetricTile label="Accuracy" value={`${overall.accuracy}%`} />
                <MetricTile label="Consistency" value={`${overall.consistency}%`} />
                <MetricTile label="Review completion" value={`${overall.reviewCompletionRate}%`} />
                <MetricTile label="Best streak" value={overall.streak} />
              </div>

              <div className="mt-5">
                <SupabaseStatus />
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-[var(--line)] bg-white/64 p-5">
              <SectionLabel>Why this plan</SectionLabel>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Retrieval first. Urgent reviews are handled before fresh work,
                then the system pushes the block with the highest score-moving
                value instead of showing everything at once.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Reviews section: put highest-value information first */}
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SecondaryInsightCard
          label="Today"
          title="Review queue"
          action={
            <span className="rounded-full bg-[var(--warning-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--warning)]">
              Clear first
            </span>
          }
        >
          <div className="space-y-3">
            {snapshot.dueConcepts.slice(0, 5).map((concept) => (
              <QueueItem
                key={concept.id}
                title={concept.name}
                meta={`${concept.topic} · ${concept.errorTrend}`}
                badge="Due"
              />
            ))}
          </div>
        </SecondaryInsightCard>

        <SecondaryInsightCard
          label="Subjects"
          title="Where to push next"
        >
          <div className="grid gap-4 xl:grid-cols-3">
            {snapshot.subjectInsights.map((insight) => (
              <SubjectOverviewCard key={insight.code} insight={insight} />
            ))}
          </div>
        </SecondaryInsightCard>
      </section>

      {/* Analytics: quieter, because it is secondary to action */}
      <section className="grid gap-6 lg:grid-cols-2">
        <SecondaryInsightCard
          label="Weaknesses"
          title="Concepts to stabilize"
          action={
            <Link
              href="/app/analytics"
              className="text-sm font-semibold text-[var(--teal)]"
            >
              Open analytics
            </Link>
          }
        >
          <div className="space-y-3">
            {snapshot.weakestConcepts.map((concept) => (
              <div
                key={concept.id}
                className="rounded-[22px] border border-[var(--line)] bg-white/72 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">
                      {concept.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {concept.topic}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {Math.round(concept.masteryScore * 100)}%
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  Most common miss: {concept.errorTrend}
                </p>
              </div>
            ))}
          </div>
        </SecondaryInsightCard>

        <SecondaryInsightCard
          label="Mistakes"
          title="Where points are leaking"
        >
          <div className="space-y-3">
            {snapshot.recentMistakes.map((mistake) => (
              <div
                key={mistake.label}
                className="rounded-[22px] border border-[var(--line)] bg-white/72 px-4 py-4"
              >
                <p className="font-semibold text-[var(--foreground)]">
                  {mistake.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {mistake.detail}
                </p>
              </div>
            ))}
          </div>
        </SecondaryInsightCard>
      </section>
     </div>
    </div>
  );
}
