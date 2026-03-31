import { getSources } from "@/lib/matura-data";

export default function SourcesPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Sources</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Provenance stays visible for every task and solution.
        </h1>
      </section>

      <div className="grid gap-4">
        {getSources().map((source) => (
          <div
            key={source.title}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5"
          >
            <p className="font-semibold text-[var(--foreground)]">{source.title}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {source.type} • {source.year} • {source.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
