import { getAdminSnapshot } from "@/lib/matura-data";

export default function AdminOverviewPage() {
  const admin = getAdminSnapshot();

  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Admin</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Content operations for ingestion, review, and publishing.
        </h1>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Tasks", value: admin.totalTasks },
          { label: "Published", value: admin.publishedTasks },
          { label: "Review queue", value: admin.reviewQueueCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              {item.label}
            </p>
            <p className="mt-3 font-display text-5xl text-[var(--foreground)]">
              {item.value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
