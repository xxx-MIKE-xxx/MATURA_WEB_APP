export default function NewTaskPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">New task</p>
        <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
          Draft a task with metadata first, solution second.
        </h1>
      </section>

      <div className="grid gap-4">
        {[
          "Prompt and stimulus",
          "Subject, topic, concept, requirement",
          "Answer mode and accepted answers",
          "Hints, solution, provenance",
        ].map((field) => (
          <div
            key={field}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5 text-sm leading-7 text-[var(--foreground)]"
          >
            {field}
          </div>
        ))}
      </div>
    </div>
  );
}
