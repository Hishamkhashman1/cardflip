import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const user = await prisma.user.findUnique({
    where: { handle: params.handle },
    include: {
      listings: { include: { card: true }, orderBy: { createdAt: "desc" }, take: 8 },
      reviewsReceived: true,
    },
  });

  if (!user) {
    notFound();
  }

  const rating = user.reviewsReceived.length
    ? user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0) / user.reviewsReceived.length
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <section className="panel glow-border rounded-3xl border border-[var(--color-border)]/70 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Collector</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-bold">@{user.handle}</h1>
          {rating ? (
            <span className="pill border-[var(--color-border)]/50 text-[0.65rem]">
              {rating.toFixed(2)} / 5 &bull; {user.reviewsReceived.length} reviews
            </span>
          ) : null}
        </div>
        <p className="text-sm text-[var(--muted)]">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Active listings", value: user.listings.length },
            { label: "Rare pulls", value: user.listings.filter((listing) => listing.card.rarity && ["Mythic", "Ultra Rare", "Secret"].includes(listing.card.rarity)).length },
            { label: "Reviews received", value: user.reviewsReceived.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[var(--color-border)]/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Listings</p>
            <h2 className="text-2xl font-semibold">Recent drops</h2>
          </div>
          <a href="/listings/new" className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs uppercase tracking-[0.3em]">
            List yours
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {user.listings.map((listing) => (
            <div key={listing.id} className="panel rounded-3xl border border-[var(--color-border)]/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{listing.card.setName}</p>
              <p className="text-lg font-semibold">{listing.card.title}</p>
              <p className="text-sm text-[var(--muted)]">
                {listing.card.condition} · {listing.card.rarity ?? "Rarity TBD"}
              </p>
              <p className="text-xl font-black text-[var(--color-accent-strong)]">
                {formatPrice(listing.priceCents, listing.currency.toUpperCase())}
              </p>
            </div>
          ))}
          {!user.listings.length ? (
            <p className="panel rounded-3xl border border-dashed border-[var(--color-border)]/70 p-6 text-sm text-[var(--muted)]">
              No listings yet.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
