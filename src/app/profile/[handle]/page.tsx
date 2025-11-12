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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--color-border)] p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground/60">Collector</p>
        <h1 className="text-3xl font-bold">@{user.handle}</h1>
        <p className="text-sm text-foreground/70">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        {rating ? <p className="mt-2 text-sm">Rating: {rating.toFixed(2)} / 5 ({user.reviewsReceived.length} reviews)</p> : null}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Listings</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {user.listings.map((listing) => (
            <div key={listing.id} className="rounded border border-[var(--color-border)] p-4">
              <p className="text-sm uppercase text-foreground/60">{listing.card.setName}</p>
              <p className="text-lg font-semibold">{listing.card.title}</p>
              <p className="text-sm text-foreground/70">{listing.card.condition} · {listing.card.rarity ?? "TBD"}</p>
              <p className="text-xl font-black text-[var(--color-accent-strong)]">
                {formatPrice(listing.priceCents, listing.currency.toUpperCase())}
              </p>
            </div>
          ))}
          {!user.listings.length ? <p className="text-sm text-foreground/60">No listings yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
