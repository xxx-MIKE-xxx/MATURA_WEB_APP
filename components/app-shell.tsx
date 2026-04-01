"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

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

function isRouteActive(pathname: string, href: string) {
  return (
    pathname === href ||
    ((href !== "/app" && href !== "/admin") && pathname.startsWith(href))
  );
}

function SidebarContent({
  pathname,
  nav,
  variant,
  onNavigate,
}: {
  pathname: string;
  nav: { href: string; label: string }[];
  variant: "app" | "admin";
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#1a3049_0%,#213b58_100%)] text-white">
      <div className="px-6 pb-6 pt-7">
        <div className="flex items-start justify-between gap-4">
          <Link href="/" className="block">
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">
              Atlas Matura
            </p>
            <h1 className="mt-2 font-display text-[2.15rem] leading-none text-white">
              {variant === "admin" ? "Content Desk" : "Study Coach"}
            </h1>
          </Link>
          <div className="rounded-full border border-white/15 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
            {variant === "admin" ? "Internal" : "Student"}
          </div>
        </div>
      </div>

      <nav className="grid gap-2 px-4">
        {nav.map((item) => {
          const active = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                active
                  ? "bg-[linear-gradient(135deg,rgba(15,109,103,0.96),rgba(31,70,117,0.92))] text-white shadow-[0_16px_38px_rgba(9,18,29,0.28)]"
                  : "text-white/78 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="truncate">{item.label}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full transition ${
                  active ? "bg-white" : "bg-white/0 group-hover:bg-white/35"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-5 pt-8">
        <div className="rounded-[28px] border border-white/12 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">
            Operating principle
          </p>
          <p className="mt-3 text-sm leading-7 text-white/82">
            Retrieval first. The planner balances urgency, confidence, task variety,
            and exam transfer so the next block feels focused instead of random.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children, variant = "app" }: AppShellProps) {
  const pathname = usePathname();
  const nav = variant === "admin" ? adminNav : appNav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentItem = nav.find((item) => isRouteActive(pathname, item.href));

  return (
    <div className="min-h-screen bg-[var(--shell)] text-[var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-hidden border-r border-white/8 shadow-[0_24px_64px_rgba(12,20,34,0.22)] lg:block">
        <SidebarContent pathname={pathname} nav={nav} variant={variant} />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[var(--line)]/80 bg-[rgba(244,239,229,0.92)] backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted-strong)]">
                Atlas Matura
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                {currentItem?.label ?? (variant === "admin" ? "Admin" : "Study Coach")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-[var(--line-strong)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-[var(--panel-shadow-soft)]"
            >
              Menu
            </button>
          </div>
        </header>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-[rgba(14,24,37,0.52)]"
            />
            <div className="relative z-10 h-full w-[86vw] max-w-[320px]">
              <SidebarContent
                pathname={pathname}
                nav={nav}
                variant={variant}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        ) : null}

        <main className="min-h-screen bg-[var(--shell)]">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
