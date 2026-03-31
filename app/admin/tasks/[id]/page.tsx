import { getTaskById } from "@/lib/matura-data";

type TaskDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailProps) {
  const { id } = await params;
  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
        Task not found.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Task detail</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">{task.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--muted)]">{task.prompt}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Metadata</p>
          <div className="mt-4 grid gap-2 text-sm leading-7 text-[var(--foreground)]">
            <p>Subject: {task.subjectCode}</p>
            <p>Exam component: {task.examComponent}</p>
            <p>Topic: {task.topic}</p>
            <p>Answer mode: {task.answerMode}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Support</p>
          <div className="mt-4 grid gap-3">
            {task.hints.map((hint) => (
              <div key={hint} className="rounded-[20px] bg-[var(--surface)] px-4 py-3 text-sm">
                {hint}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
