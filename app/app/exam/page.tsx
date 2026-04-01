import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getSubjectInsights, planAdaptiveSession } from "@/lib/matura-data";

export default function ExamPage() {
  const examSession = planAdaptiveSession({
    subjectCode: "math",
    mode: "exam",
    taskCount: 5,
    durationMinutes: 45,
  });
  const mathInsight = getSubjectInsights().find((subject) => subject.code === "math")!;

  return (
    <div className="grid gap-6 lg:gap-8">
      <PageHero
        eyebrow="Exam simulation"
        title="Timed practice should feel serious, clear, and worth starting right away."
        description="Exam mode locks hints during the attempt and returns the analysis after submission, so you rehearse performance under pressure instead of guided practice."
        aside={
          <div className="rounded-[30px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,229,215,0.88))] p-5 shadow-[var(--panel-shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
              Math exam signal
            </p>
            <p className="mt-3 font-display text-5xl text-[var(--foreground)]">
              {mathInsight.predictedScore}%
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Expected band {mathInsight.rangeLow}-{mathInsight.rangeHigh}% •{" "}
              {mathInsight.confidenceLabel.toLowerCase()}
            </p>
          </div>
        }
      />

      <section className="overflow-hidden rounded-[34px] border border-[var(--line-strong)] bg-[linear-gradient(135deg,#1b2d43_0%,#16314d_45%,#0f6d67_100%)] p-6 text-white shadow-[var(--panel-shadow-strong)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_320px] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              {[
                "Math basic",
                `${examSession.taskCount} sections`,
                `${examSession.durationMinutes} minutes`,
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/88"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h2 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] text-white sm:text-6xl">
              45-minute official-style block
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/82">
              Best for checking whether your score holds up when hints disappear. Start
              this when you want a clean read on timing, pressure, and method choice.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/62">
                  Predicted band
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {mathInsight.rangeLow}-{mathInsight.rangeHigh}%
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/62">
                  Confidence
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {mathInsight.confidenceLabel}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/62">
                  Main risk
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {mathInsight.weakestConcept.errorTrend}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white/95 p-5 text-[var(--foreground)] shadow-[0_18px_44px_rgba(11,18,28,0.22)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
              Launch
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              Start when you want a real score signal.
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Hints stay locked, the timer stays visible, and the post-run review focuses on
              what would most improve your next attempt.
            </p>
            <Link
              href="/app/study/session/mock-exam?subject=math&mode=exam&count=5&duration=45"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--navy)] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_36px_rgba(27,45,67,0.24)] transition hover:-translate-y-0.5 hover:bg-[#10243b]"
            >
              Start exam simulation
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            Section map
          </p>
          <div className="mt-5 grid gap-3">
            {examSession.tasks.map((task, index) => (
              <div key={task.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                      Section {index + 1}
                    </p>
                    <p className="mt-2 font-semibold text-[var(--foreground)]">{task.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {task.topic} • {task.taskTypeLabel}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-strong)]">
                    {task.estimatedTimeSec}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-strong)]">
            Before you start
          </p>
          <div className="mt-5 grid gap-3">
            {[
              "Use it when you can give the timer your full attention.",
              "Review the post-run analysis immediately while errors are still fresh.",
              "If the score drops sharply, switch the next session back to Review instead of forcing another mock.",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-[var(--line)] px-4 py-4 text-sm leading-7 text-[var(--foreground)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
