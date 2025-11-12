"use client";

import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function UserMenu({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-[var(--color-border)] px-4 py-1 text-sm"
          onClick={() => signIn()}
        >
          Sign in
        </button>
        <Link
          href="/signup"
          className="rounded-full bg-[var(--color-accent-strong)] px-4 py-1 text-sm font-semibold text-white"
        >
          Join
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href={`/profile/${session.user.handle ?? session.user.id}`} className="font-semibold">
        @{session.user.handle ?? "collector"}
      </Link>
      <button
        type="button"
        className="rounded-full border border-[var(--color-border)] px-3 py-1"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign out
      </button>
    </div>
  );
}
