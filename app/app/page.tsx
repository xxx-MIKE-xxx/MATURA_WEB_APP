import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ReadinessCard } from "@/components/readiness-card";
import { SupabaseStatus } from "@/components/supabase-status";
import { getDashboardSnapshot } from "@/lib/matura-data";

export default function DashboardPage() {
  const snapshot = getDashboardSnapshot();
  const overall = snapshot.overall;

  return (
    <div className="grid gap-6 lg:gap-8">
      <PageHero
        eyebrow="Today"
        title={`${snapshot.countdownDays} days until Matura. Keep the easy points safe and push your strongest score band higher.`}
        description="Your plan is built around score movement, not busywork. Clear due reviews first, then take the recommended block while your focus is still fresh."
        aside={
          <div className="rounded-[30px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(239,229,215,0.9))] p-5 shadow-[var(--panel-shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
              Exam snapshot
            </p>
            <div className="mt-4 grid gap-4">
              <div>
                <p className="font-display text-5xl text-[var(--foreground)]">
                  {overall.predictedScore}%
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Predicted band {overall.rangeLow}-{overall.rangeHigh}% •{" "}
                  {overall.confidenceLabel.toLowerCase()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-white/80 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                    Ready now
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {overall.readiness}%
                  </p>
                </div>
                <div className="rounded-[22px] bg-white/80 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                    Due today
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--warning)]">
                    {overall.dueReviews}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/app/study/session/recommended?subject=math&mode=practice&count=4"
                  className="app-button-primary"
                >
                  Continue recommended block
                </Link>
                <Link href="/app/review" className="app-button-secondary">
                  Review due work
                </Link>
              </div>
              <SupabaseStatus />
            </div>
          </div>
        }
      />

      {/* Bring the next action and due review cards directly under the hero so that the most important actions are seen first. */}
      <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[30px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,251,244,0.98),rgba(239,229,215,0.96))] p-6 shadow-[var(--panel-shadow)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
            Today&apos;s next action
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {snapshot.recommended.subject.name} {snapshot.recommended.mode}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            {snapshot.nextAction}
          </p>

          <div className="mt-6 grid gap-3">
            {snapshot.recommended.tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="rounded-[22px] border border-[var(--line)] bg-white/82 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{task.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {task.reasons.join(" • ")}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
                    {task.estimatedTimeSec}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--line-strong)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
                Review queue
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                Due reviews
              </h2>
            </div>
            <span className="rounded-full bg-[var(--warning-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--warning)]">
              Clear today
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {snapshot.dueConcepts.slice(0, 5).map((concept) => (
              <div
                key={concept.id}
                className="flex items-start justify-between gap-4 rounded-[22px] border border-[var(--line)] px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[var(--foreground)]">{concept.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {concept.topic} • {concept.errorTrend}
                  </p>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--warning)]">
                  Due
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject overview comes after the primary actions. Present the subject cards as a compact comparison. */}
      <section className="grid gap-5 xl:grid-cols-3">
        {snapshot.subjectInsights.map((insight) => (
          <ReadinessCard
            key={insight.code}
            insight={insight}
            href={`/app/study/session/${insight.code}?subject=${insight.code}&mode=practice&count=4`}
          />
        ))}
      </section>

      {/* The analytics section (weakest concepts and mistake patterns) comes last to avoid competing with the key actions. */}
      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                Weakest right now
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                Concepts to stabilize
              </h2>
            </div>
            <Link href="/app/analytics" className="text-sm font-semibold text-[var(--teal)]">
              Open analytics
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {snapshot.weakestConcepts.map((concept) => (
              <div key={concept.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{concept.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{concept.topic}</p>
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
        </div>

        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            Mistake pattern watch
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            Where points are slipping
          </h2>
          <div className="mt-5 grid gap-3">
            {snapshot.recentMistakes.map((mistake) => (
              <div key={mistake.label} className="rounded-[22px] border border-[var(--line)] px-4 py-4">
                <p className="font-semibold text-[var(--foreground)]">{mistake.label}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{mistake.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}