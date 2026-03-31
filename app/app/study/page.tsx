import Link from "next/link";
import { getStudyModes, getSubjects, planAdaptiveSession } from "@/lib/matura-data";

export default function StudyBuilderPage() {
  const subjects = getSubjects();
  const modes = getStudyModes();
  const recommended = planAdaptiveSession({
    subjectCode: "math",
    mode: "practice",
    durationMinutes: 28,
    taskCount: 4,
  });

  return (
    <div className="grid gap-8">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Study builder</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Compose a session by subject, mode, pacing, and topic focus.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--muted)]">
          The planner applies constrained randomness. You get variety, but not chaos:
          overdue concepts, confusable neighbors, and difficulty band control all influence
          the next task.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Recommended block
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {recommended.subject.name} {recommended.mode}
          </h2>
          <div className="mt-5 grid gap-3">
            {recommended.tasks.map((task) => (
              <div key={task.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                <p className="font-semibold text-[var(--foreground)]">{task.title}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{task.reasons.join(" • ")}</p>
              </div>
            ))}
          </div>
          <Link
            href="/app/study/session/recommended?subject=math&mode=practice&count=4"
            className="mt-5 inline-flex rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white"
          >
            Launch this session
          </Link>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Subjects</p>
            <div className="mt-4 grid gap-3">
              {subjects.map((subject) => (
                <Link
                  key={subject.code}
                  href={`/app/study/session/${subject.code}?subject=${subject.code}&mode=practice&count=4`}
                  className="rounded-[22px] border border-[var(--line)] px-4 py-4 transition hover:border-[var(--teal)]"
                >
                  <p className="font-semibold text-[var(--foreground)]">{subject.name}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {subject.focusDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Modes</p>
            <div className="mt-4 grid gap-3">
              {modes.map((mode) => (
                <div key={mode.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                  <p className="font-semibold text-[var(--foreground)]">{mode.name}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {mode.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
