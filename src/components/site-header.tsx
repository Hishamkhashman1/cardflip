import Link from "next/link";
import type { Session } from "next-auth";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

const navLinks = [
  { href: "/", label: "Catalog" },
  { href: "/listings/new", label: "Create" },
  { href: "/orders", label: "Orders" },
  { href: "/messages", label: "Messages" },
  { href: "/policy", label: "Policy" },
];

export function SiteHeader({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)]/70 bg-[color:var(--background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-mono text-lg font-black uppercase tracking-[0.4em]">
            CardFlip
            <span className="pill text-[0.6rem]">Beta</span>
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Original creature marketplace
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-2 text-sm font-medium text-[var(--muted)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-transparent px-3 py-1 transition hover:border-[var(--color-border)] hover:text-[var(--color-foreground)]"
              >
                {link.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="rounded-full border border-transparent px-3 py-1 text-[var(--color-accent-strong)] transition hover:border-[var(--color-border)]"
              >
                Admin
              </Link>
            ) : null}
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/listings/new"
              className="hidden rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm font-semibold text-[color:var(--color-foreground)] transition hover:border-[var(--color-accent)] md:inline-flex"
            >
              Start selling
            </Link>
            <ThemeToggle />
            <UserMenu session={session} />
          </div>
        </div>
        <div className="panel-muted hidden border border-dashed border-[var(--color-border)]/60 px-4 py-3 text-xs text-[var(--muted)] md:block">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Active listings", value: "120+" },
              { label: "Creators paid", value: "$82K" },
              { label: "Avg. payout", value: "$246" },
              { label: "Platform fee", value: "7.5%" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-[0.65rem] uppercase tracking-[0.3em]">{item.label}</p>
                <p className="text-sm font-semibold text-[var(--color-foreground)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
