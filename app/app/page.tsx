import Link from "next/link";
import { getDashboardSnapshot, getSubjects } from "@/lib/matura-data";
import { SupabaseStatus } from "@/components/supabase-status";

export default function DashboardPage() {
  const snapshot = getDashboardSnapshot();
  const subjects = getSubjects();

  return (
    <div className="grid gap-8">
      <section className="rounded-[36px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
              Today&apos;s plan
            </p>
            <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
              Clear due reviews first, then attack unstable math concepts.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--muted)]">
              The planner is choosing geometry retrieval because it is overdue, weak, and
              easy to contrast with algebra and English register work inside the same week.
            </p>
          </div>
          <div className="grid gap-3 text-right">
            <span className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Spring exam window
            </span>
            <span className="font-display text-5xl text-[var(--foreground)]">
              {snapshot.countdownDays} days
            </span>
            <SupabaseStatus />
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] bg-[var(--surface)] px-5 py-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Recommended session
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {snapshot.recommended.subject.name} {snapshot.recommended.mode}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {snapshot.recommended.summary.dominantGoal}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/app/study/session/recommended?subject=math&mode=practice&count=4"
                className="rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white"
              >
                Start recommended block
              </Link>
              <Link
                href="/app/study"
                className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
              >
                Rebuild session
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-white px-5 py-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Due concepts
            </p>
            <div className="mt-4 grid gap-3">
              {snapshot.dueConcepts.slice(0, 4).map((concept) => (
                <div key={concept.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {concept.name}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{concept.errorTrend}</p>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    due
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {subjects.map((subject) => (
          <article
            key={subject.code}
            className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              {subject.name}
            </p>
            <p className="mt-4 font-display text-4xl text-[var(--foreground)]">
              {subject.readiness}%
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {subject.focusDescription}
            </p>
            <div className="mt-6 h-2 rounded-full bg-[var(--surface)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${subject.readiness}%`,
                  backgroundColor: subject.accent,
                }}
              />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Weakest concepts
          </p>
          <div className="mt-4 grid gap-3">
            {snapshot.weakestConcepts.map((concept) => (
              <div key={concept.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-[var(--foreground)]">{concept.name}</p>
                  <span className="text-sm text-[var(--muted)]">
                    {Math.round(concept.masteryScore * 100)}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{concept.errorTrend}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Recent mistakes
          </p>
          <div className="mt-4 grid gap-3">
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
