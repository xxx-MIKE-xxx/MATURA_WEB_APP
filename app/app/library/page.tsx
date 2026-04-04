import { LibraryExplorer } from "@/components/library-explorer";
import { getAvailableSubjects, getTaskLibrary } from "@/lib/features/study/service";

export default async function LibraryPage() {
  const [tasks, subjects] = await Promise.all([getTaskLibrary(), getAvailableSubjects()]);

  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Library</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Search tasks by subject, answer mode, topic, and difficulty.
        </h1>
      </section>

      <LibraryExplorer tasks={tasks} subjects={subjects} />
    </div>
  );
}
