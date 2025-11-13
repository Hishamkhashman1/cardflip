import { redirect } from "next/navigation";

import { ListingForm } from "./listing-form";
import { getServerAuthSession } from "@/lib/auth/session";
import { env } from "@/env";

export default async function NewListingPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/listings/new");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <section className="panel glow-border space-y-3 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Listing flow</p>
        <h1 className="text-3xl font-bold leading-tight">Share a new original creature card</h1>
        <p className="max-w-2xl text-sm text-[var(--muted)]">
          Upload your artwork, confirm condition + pricing, then publish instantly. Every listing is reviewed for content safety and Stripe-compatible payouts.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
          <ListingForm platformFeeBps={env.PLATFORM_FEE_BPS} />
        </div>
        <aside className="space-y-4">
          <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Checklist</p>
            <ul className="mt-4 space-y-2 text-[var(--muted)]">
              <li>• Only upload original artwork you created.</li>
              <li>• Avoid trademarked names or references.</li>
              <li>• Provide accurate condition + numbering.</li>
              <li>• Confirm you can fulfill shipping in 3 days.</li>
            </ul>
          </div>
          <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Why we ask</p>
            <p className="mt-3 text-[var(--muted)]">
              Metadata powers search filters and automated rarity suggestions. Accurate data helps buyers trust your drop and keeps payouts instant.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
