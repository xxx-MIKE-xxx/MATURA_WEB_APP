export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">About</p>
      <h1 className="mt-5 font-display text-6xl text-[var(--foreground)]">
        Atlas Matura is built around learning science, not streak theater.
      </h1>
      <div className="mt-8 grid gap-6 text-sm leading-8 text-[var(--muted)]">
        <p>
          The product combines retrieval practice, spaced review, constrained interleaving,
          exam simulations, and targeted feedback for Polish Matura preparation.
        </p>
        <p>
          The MVP focuses on math, English, and Polish, with an adaptive engine that makes
          every session explainable: why this task, why now, and what should happen next.
        </p>
      </div>
    </main>
  );
}
