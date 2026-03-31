export default function LegalPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Legal</p>
      <h1 className="mt-5 font-display text-6xl text-[var(--foreground)]">
        Educational support, not an official scoring authority.
      </h1>
      <div className="mt-8 grid gap-6 text-sm leading-8 text-[var(--muted)]">
        <p>
          AI-generated explanations and feedback are draft assistance only. Official answer
          keys, grading rubrics, and human review stay the source of truth for high-stakes use.
        </p>
        <p>
          The included schema is designed for row-level security in Supabase so user progress,
          saved tasks, and study history remain scoped to each learner account.
        </p>
      </div>
    </main>
  );
}
