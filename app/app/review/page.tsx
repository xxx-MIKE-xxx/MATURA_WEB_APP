import { getDueConcepts } from "@/lib/matura-data";

export default function ReviewPage() {
  const dueConcepts = getDueConcepts();

  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Review queue</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Scheduled retrieval, ordered by what is most at risk of being forgotten.
        </h1>
      </section>

      <section className="grid gap-4">
        {dueConcepts.map((concept) => (
          <article
            key={concept.id}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  {concept.topic}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  {concept.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Next due
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {concept.nextDueAt}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Recent pattern: {concept.errorTrend}. Hint dependency is{" "}
              {Math.round(concept.hintDependencyScore * 100)}%, so this concept should return
              with a short interval even after a correct answer.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
