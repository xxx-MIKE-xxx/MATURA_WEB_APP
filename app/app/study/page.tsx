import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ReadinessCard } from "@/components/readiness-card";
import { getStudyModes, getSubjectInsights, planAdaptiveSession } from "@/lib/matura-data";
import { getAvailableSubjects } from "@/lib/features/study/service";

export default async function StudyBuilderPage() {
  const availableSubjects = await getAvailableSubjects();
  const subjectInsights = getSubjectInsights();
  const modes = getStudyModes();
  const recommended = planAdaptiveSession({
    subjectCode: "math",
    mode: "practice",
    durationMinutes: 28,
    taskCount: 4,
  });
  const physicsSubject = availableSubjects.find((subject) => subject.code === "physics");

  return (
    <div className="grid gap-6 lg:gap-8">
      <PageHero
        eyebrow="Study builder"
        title="Choose today’s subject first. The rest of the session should support that choice, not compete with it."
        description="Pick the subject you want to move right now. Each card shows predicted score, confidence, and the cleanest next step."
        aside={
          <div className="rounded-[28px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,229,215,0.86))] p-5 shadow-[var(--panel-shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
              Quick start
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {recommended.subject.name} {recommended.mode}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {recommended.taskCount} tasks • {recommended.durationMinutes} minutes •{" "}
              {recommended.summary.pacingLabel.toLowerCase()}
            </p>
            <Link
              href="/app/study/session/recommended?subject=math&mode=practice&count=4"
              className="app-button-primary mt-5"
            >
              Launch recommended block
            </Link>
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-3">
        {subjectInsights.map((insight) => (
          <ReadinessCard
            key={insight.code}
            insight={insight}
            href={`/app/study/session/${insight.code}?subject=${insight.code}&mode=practice&count=4`}
            emphasis="strong"
          />
        ))}
      </section>

      {physicsSubject ? (
        <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
                Physics pilot
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                Physics now uses the server-backed provider path.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Use the library or start a one-task practice block to verify prompt, assets,
                official solution, and persistence against Supabase-backed content.
              </p>
            </div>

            <Link
              href="/app/study/session/physics-pilot?subject=physics&mode=practice&count=1"
              className="app-button-primary"
            >
              Open physics pilot
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,251,244,0.98),rgba(239,229,215,0.96))] p-6 shadow-[var(--panel-shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
                Recommended plan
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                {recommended.subject.name} practice block
              </h2>
            </div>
            <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
              Start here if unsure
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {recommended.tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[22px] border border-[var(--line)] bg-white/82 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{task.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {task.reasons.join(" • ")}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {task.difficultyBase}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
              Modes
            </p>
            <div className="mt-4 grid gap-3">
              {modes.map((mode) => (
                <div key={mode.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-[var(--foreground)]">{mode.name}</p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                      {mode.id}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {mode.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--panel-shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
              Planner note
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              Why the order changes
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              The planner rotates between urgency, weak concepts, and task contrast. That
              keeps the session focused without locking you into one repetitive format.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
