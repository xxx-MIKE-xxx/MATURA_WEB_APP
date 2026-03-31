import { getImportJobs } from "@/lib/matura-data";

export default function ImportsPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Imports</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Manual and semi-automated ingestion queue.
        </h1>
      </section>

      <div className="grid gap-4">
        {getImportJobs().map((job) => (
          <div
            key={job.id}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--foreground)]">{job.source}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{job.itemCount} items</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
