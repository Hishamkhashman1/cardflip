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
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearch = await searchParams;
  const flattened = Object.fromEntries(
    Object.entries(resolvedSearch).map(([key, value]) => [key, Array.isArray(value) ? value.at(-1) : value])
  );
  const filters = listingFiltersSchema.parse({ ...flattened, cursor: undefined, limit: flattened.limit ?? "12" });
  const { listings, nextCursor } = await listPublicListings(filters);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-8">
      <section className="panel glow-border relative overflow-hidden p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="pill border-[var(--color-border)]/60">Creator marketplace</span>
              <h1 className="text-4xl font-black leading-tight lg:text-5xl">
                Trade original creature cards without the IP baggage.
              </h1>
              <p className="max-w-2xl text-base text-[var(--muted)] lg:text-lg">
                CardFlip helps independent artists list handmade creatures, collect secure payments via Stripe, and stay compliant with a moderated, content-safe catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="rounded-full bg-[var(--color-accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Browse listings
              </a>
              <a
                href="/listings/new"
                className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--color-accent)]"
              >
                List a card
              </a>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Platform fee", value: "7.5%" },
                { label: "Avg. seller payout", value: "$246" },
                { label: "Listings reviewed weekly", value: "100%" },
                { label: "Messaging response SLA", value: "24h" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--color-border)]/60 px-4 py-3">
                  <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[var(--muted)]">{item.label}</p>
                  <p className="text-2xl font-black text-[var(--color-foreground)]">{item.value}</p>
                </div>
              ))}
            </dl>
          </div>
          <div className="panel-muted relative overflow-hidden rounded-3xl border border-[var(--color-border)]/70 p-6">
            <div className="absolute -right-10 top-10 h-56 w-56 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
            <div className="absolute -left-6 bottom-10 h-48 w-48 rounded-full bg-[var(--color-accent-strong)]/20 blur-3xl" />
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Listing flow</p>
            <ol className="mt-6 space-y-4 text-sm">
              {[
                { title: "Upload your original card artwork", body: "UploadThing handles secure image uploads with user-level auth." },
                { title: "Preview rarity + platform fees", body: "Use the optional pokemontcg.io adapter to prefill metadata and show sellers their payout." },
                { title: "Publish instantly & share", body: "Instantly appear in the public catalog with messaging + checkout enabled." },
              ].map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-[var(--color-border)]/70 bg-[color:var(--background)]/40 p-4">
                  <div className="pill mb-3 border-[var(--color-border)]/50 text-[0.55rem]">
                    Step {index + 1}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <FilterBar current={flattened} />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Stripe-native checkout",
            body: "Automatic Connect transfers or dev stubs keep the flow unblocked.",
          },
          {
            title: "Content safety baked in",
            body: "Titles run through blocklists and manual reviews to stay IP-safe.",
          },
          {
            title: "Messaging that follows orders",
            body: "Threads attach to listings + orders for one continuous conversation.",
          },
        ].map((feature) => (
          <div key={feature.title} className="panel-muted rounded-2xl border border-[var(--color-border)]/50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Feature</p>
            <h3 className="mt-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-[var(--muted)]">{feature.body}</p>
          </div>
        ))}
      </section>

      <section id="catalog" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Live catalog</p>
            <h2 className="text-2xl font-bold">Latest original drops</h2>
          </div>
          <a href="/listings/new" className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs uppercase tracking-[0.3em]">
            Submit yours
          </a>
        </div>
        <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-4">
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
      </section>
    </div>
  );
}
