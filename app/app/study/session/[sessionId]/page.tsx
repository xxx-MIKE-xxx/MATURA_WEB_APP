import { SessionPlayer } from "@/components/session-player";
import { getSubjects, planAdaptiveSession, type SubjectCode, type StudyMode } from "@/lib/matura-data";

type SessionPageProps = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SessionPage({ params, searchParams }: SessionPageProps) {
  const [{ sessionId }, query] = await Promise.all([params, searchParams]);
  const subject = query.subject;
  const mode = query.mode;
  const count = query.count;
  const duration = query.duration;

  const validSubjects = new Set(getSubjects().map((item) => item.code));
  const subjectCode =
    typeof subject === "string" && validSubjects.has(subject as SubjectCode)
      ? (subject as SubjectCode)
      : "math";
  const studyMode =
    typeof mode === "string" &&
    ["learn", "practice", "review", "exam"].includes(mode)
      ? (mode as StudyMode)
      : "practice";

  const session = planAdaptiveSession({
    subjectCode,
    mode: studyMode,
    taskCount: typeof count === "string" ? Number(count) : undefined,
    durationMinutes: typeof duration === "string" ? Number(duration) : undefined,
  });

  return (
    <div className="grid gap-6">
      <div className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Session {sessionId}
        </p>
        <h1 className="mt-3 font-display text-5xl text-[var(--foreground)]">
          {session.subject.name} {session.mode}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)]">
          Candidate pool: {session.summary.candidatePoolSize}. Due concepts in subject:{" "}
          {session.summary.dueConcepts}. Pacing: {session.summary.pacingLabel}.
        </p>
      </div>

      <SessionPlayer session={session} />
    </div>
  );
}
