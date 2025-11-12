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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground/60">Listing flow</p>
        <h1 className="text-3xl font-bold">Create a listing</h1>
        <p className="text-foreground/70">Upload your original creature card, preview Stripe fees, then publish instantly.</p>
      </div>
      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[color:var(--background)]/70 p-6">
        <ListingForm platformFeeBps={env.PLATFORM_FEE_BPS} />
      </div>
    </div>
  );
}
