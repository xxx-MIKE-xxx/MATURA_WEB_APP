import { LibraryExplorer } from "@/components/library-explorer";
import { getTasks } from "@/lib/matura-data";

export default function LibraryPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Library</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Search tasks by subject, answer mode, topic, and difficulty.
        </h1>
      </section>

      <LibraryExplorer tasks={getTasks()} />
    </div>
  );
}
