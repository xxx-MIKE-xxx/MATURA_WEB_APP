import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,251,244,0.98))] p-6 shadow-[var(--panel-shadow)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-strong)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[0.95] text-[var(--foreground)] sm:text-5xl xl:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--muted)] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </section>
  );
}
