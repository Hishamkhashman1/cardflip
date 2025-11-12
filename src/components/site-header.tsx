import Link from "next/link";
import type { Session } from "next-auth";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

export function SiteHeader({ session }: { session: Session | null }) {
  return (
    <header className="border-b border-[var(--color-border)] bg-[color:var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-mono text-xl font-black uppercase tracking-widest">
            CardFlip
          </Link>
          <nav className="hidden gap-4 text-sm md:flex">
            <Link href="/listings/new" className="hover:text-[var(--color-accent-strong)]">
              Sell a card
            </Link>
            <Link href="/orders" className="hover:text-[var(--color-accent-strong)]">
              Orders
            </Link>
            <Link href="/messages" className="hover:text-[var(--color-accent-strong)]">
              Messages
            </Link>
            <Link href="/admin" className="hover:text-[var(--color-accent-strong)]">
              Admin
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}
