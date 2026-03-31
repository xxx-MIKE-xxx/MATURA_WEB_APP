import Link from "next/link";
import { getTasks } from "@/lib/matura-data";

export default function AdminTasksPage() {
  const tasks = getTasks();

  return (
    <div className="grid gap-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Tasks</p>
          <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
            Review, edit, and publish task inventory.
          </h1>
        </div>
        <Link
          href="/admin/tasks/new"
          className="rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white"
        >
          New task
        </Link>
      </section>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/admin/tasks/${task.id}`}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5 transition hover:border-[var(--teal)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">
                  {task.subjectCode} • {task.examComponent}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  {task.title}
                </h2>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                {task.answerMode}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
