import Link from "next/link";
import { getStudyModes, getSubjects } from "@/lib/matura-data";
import { SupabaseStatus } from "@/components/supabase-status";

export default function HomePage() {
  const subjects = getSubjects();
  const modes = getStudyModes();

  return (
    <main className="overflow-hidden">
      <section className="relative isolate min-h-screen border-b border-[var(--line)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,109,103,0.18),_transparent_33%),linear-gradient(135deg,#1b2d43_0%,#142433_42%,#11212f_100%)]" />
        <div className="absolute inset-y-0 right-0 w-[42vw] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
        <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-6 py-8 text-white sm:px-8 lg:px-12">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.38em] text-white/65">
                Atlas Matura
              </p>
              <p className="mt-2 text-sm text-white/72">
                Adaptive exam prep for math, Polish, and English
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-white/78">
              <Link href="/about">About</Link>
              <Link href="/legal">Legal</Link>
              <Link href="/login">Login</Link>
              <Link
                href="/app"
                className="rounded-full border border-white/20 px-4 py-2 font-semibold text-white"
              >
                Open demo app
              </Link>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:py-0">
            <div className="max-w-4xl">
              <p className="text-sm uppercase tracking-[0.35em] text-[rgba(255,255,255,0.65)]">
                Retrieval before reveal
              </p>
              <h1 className="mt-6 max-w-5xl font-display text-6xl leading-none text-white sm:text-7xl lg:text-[6.4rem]">
                A study engine that chooses the next best Matura task.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/78">
                Atlas Matura turns official-style content into adaptive practice blocks,
                due reviews, and exam simulations instead of random worksheets or black-box
                tutoring.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/app"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--navy)] transition hover:opacity-92"
                >
                  Launch the student dashboard
                </Link>
                <Link
                  href="/admin"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  Open the content desk
                </Link>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-3">
                {subjects.map((subject) => (
                  <div key={subject.code} className="border-t border-white/16 pt-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/55">
                      {subject.shortName}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {subject.readiness}% ready
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {subject.focusLabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/12 bg-white/8 p-5 backdrop-blur lg:p-6">
              <div className="rounded-[28px] bg-[rgba(255,255,255,0.94)] p-5 text-[var(--foreground)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Recommended block
                </p>
                <h2 className="mt-3 font-display text-4xl">Math practice sprint</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  The planner is prioritizing Pythagorean retrieval, formal English register,
                  and Polish thesis precision because those concepts are overdue or still
                  unstable.
                </p>

                <div className="mt-6 grid gap-3">
                  {modes.map((mode) => (
                    <div
                      key={mode.id}
                      className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{mode.name}</p>
                        <span className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                          {mode.id}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {mode.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pb-8">
            <SupabaseStatus />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
            Product direction
          </p>
          <h2 className="mt-5 max-w-xl font-display text-5xl text-[var(--foreground)]">
            Not a flashcard app. Not an AI tutor. A transparent exam coach.
          </h2>
        </div>

        <div className="grid gap-5">
          {subjects.map((subject) => (
            <article
              key={subject.code}
              className="rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] px-6 py-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    {subject.name}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {subject.focusLabel}
                  </h3>
                </div>
                <span
                  className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em]"
                  style={{
                    backgroundColor: subject.accentSoft,
                    color: subject.accent,
                  }}
                >
                  {subject.dueReviews} due reviews
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                {subject.focusDescription}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
