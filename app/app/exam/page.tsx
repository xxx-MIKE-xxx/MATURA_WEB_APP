import Link from "next/link";
import { planAdaptiveSession } from "@/lib/matura-data";

export default function ExamPage() {
  const examSession = planAdaptiveSession({
    subjectCode: "math",
    mode: "exam",
    taskCount: 5,
    durationMinutes: 45,
  });

  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Exam simulation</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Practice transfer, not just correctness.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--muted)]">
          Exam mode removes adaptive hints during the attempt and returns analysis only after
          submission, so students rehearse authentic decision-making.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Mock distribution
          </p>
          <div className="mt-4 grid gap-3">
            {examSession.tasks.map((task, index) => (
              <div key={task.id} className="rounded-[22px] bg-[var(--surface)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Section {index + 1}
                </p>
                <p className="mt-2 font-semibold text-[var(--foreground)]">{task.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {task.topic} • {task.estimatedTimeSec} sec target
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Launch</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            45-minute official-style block
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            The preview ships with math exam mode first, matching the MVP recommendation to
            polish one subject deeply before expanding breadth.
          </p>
          <Link
            href="/app/study/session/mock-exam?subject=math&mode=exam&count=5&duration=45"
            className="mt-6 inline-flex rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white"
          >
            Start exam simulation
          </Link>
        </div>
      </section>
    </div>
  );
}
