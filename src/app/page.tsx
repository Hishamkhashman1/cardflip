import type { Metadata } from "next";

import { FilterBar } from "@/components/listings/filter-bar";
import { ListingsInfiniteGrid } from "@/components/listings/infinite-grid";
import { listPublicListings, listingFiltersSchema } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CardFlip Marketplace",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const flattened = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value.at(-1) : value])
  );
  const filters = listingFiltersSchema.parse({ ...flattened, cursor: undefined, limit: flattened.limit ?? "12" });
  const { listings, nextCursor } = await listPublicListings(filters);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <section className="grid gap-6 rounded-2xl bg-gradient-to-r from-[var(--color-accent-strong)]/15 to-[var(--color-accent)]/10 p-8 text-balance">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-foreground/70">Peer marketplace</p>
          <h1 className="text-4xl font-black leading-tight">Trade original creature cards without the IP baggage.</h1>
          <p className="text-lg text-foreground/80">
            CardFlip lets creators list their handmade creatures, manage offers, collect secure payments via Stripe Checkout, and chat with buyers — all with a transparent 7.5% platform fee.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-2xl font-black">7.5%</p>
            <p className="text-foreground/70">Flat platform fee</p>
          </div>
          <div>
            <p className="text-2xl font-black">Stripe Connect</p>
            <p className="text-foreground/70">Automatic seller payouts</p>
          </div>
          <div>
            <p className="text-2xl font-black">Content-safe</p>
            <p className="text-foreground/70">Blocks trademarked titles</p>
          </div>
        </div>
      </section>

      <FilterBar current={flattened} />

      <ListingsInfiniteGrid
        initialListings={listings}
        initialCursor={nextCursor}
        filters={{
          q: flattened.q,
          rarity: flattened.rarity,
          condition: flattened.condition,
          min: flattened.min,
          max: flattened.max,
          sort: flattened.sort ?? "newest",
        }}
      />
    </div>
  );
}
