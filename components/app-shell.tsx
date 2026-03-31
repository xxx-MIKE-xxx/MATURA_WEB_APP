"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  variant?: "app" | "admin";
};

const appNav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/study", label: "Study" },
  { href: "/app/review", label: "Review" },
  { href: "/app/exam", label: "Exam" },
  { href: "/app/library", label: "Library" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/settings", label: "Settings" },
];

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/imports", label: "Imports" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/review-queue", label: "Review Queue" },
];

export function AppShell({ children, variant = "app" }: AppShellProps) {
  const pathname = usePathname();
  const nav = variant === "admin" ? adminNav : appNav;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-[var(--line)] bg-[color:var(--navy)] px-6 py-6 text-white lg:border-b-0 lg:border-r lg:px-8">
          <div className="flex items-center justify-between lg:block">
            <Link href="/" className="block">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                Atlas Matura
              </p>
              <h1 className="font-display text-3xl text-white">
                {variant === "admin" ? "Content Desk" : "Study Coach"}
              </h1>
            </Link>
            <div className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
              {variant === "admin" ? "Internal" : "Student"}
            </div>
          </div>

          <nav className="mt-8 grid gap-2">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/app" &&
                  item.href !== "/admin" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-white text-[color:var(--navy)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-[28px] border border-white/15 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/55">
              Operating principle
            </p>
            <p className="mt-3 text-sm leading-6 text-white/78">
              Retrieval before reveal. The app chooses the next task from weakness,
              spacing, exam importance, and interleaving pressure.
            </p>
          </div>
        </aside>

        <main className="min-w-0 px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
