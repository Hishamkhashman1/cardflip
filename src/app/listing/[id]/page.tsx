import Image from "next/image";
import { notFound } from "next/navigation";

import { BuyNowButton } from "@/components/buy-now-button";
import { getServerAuthSession } from "@/lib/auth/session";
import { getListingById } from "@/lib/listings";
import { formatPrice } from "@/lib/utils";

export default async function ListingDetail({ params }: { params: { id: string } }) {
  const [listing, session] = await Promise.all([getListingById(params.id), getServerAuthSession()]);
  if (!listing) {
    notFound();
  }

  const isOwner = session?.user?.id === listing.sellerId;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-black/5 p-4">
            {listing.card.imageUrl ? (
              <Image
                src={listing.card.imageUrl}
                alt={listing.card.title}
                width={800}
                height={500}
                className="w-full rounded-xl object-cover"
              />
            ) : (
              <div className="aspect-video w-full rounded-xl bg-[var(--color-border)]" />
            )}
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] p-6">
            <h2 className="text-xl font-semibold">Details</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-foreground/60">Set</dt>
                <dd className="font-medium">{listing.card.setName}</dd>
              </div>
              <div>
                <dt className="text-foreground/60">Number</dt>
                <dd className="font-medium">{listing.card.number}</dd>
              </div>
              <div>
                <dt className="text-foreground/60">Rarity</dt>
                <dd className="font-medium">{listing.card.rarity ?? "TBD"}</dd>
              </div>
              <div>
                <dt className="text-foreground/60">Condition</dt>
                <dd className="font-medium">{listing.card.condition}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--color-border)] p-6">
            <p className="text-sm uppercase tracking-[0.4em] text-foreground/60">Seller</p>
            <p className="text-lg font-semibold">@{listing.seller.handle}</p>
            <p className="text-3xl font-black text-[var(--color-accent-strong)]">
              {formatPrice(listing.priceCents, listing.currency.toUpperCase())}
            </p>
            {!isOwner ? <BuyNowButton listingId={listing.id} /> : <p className="text-sm text-foreground/70">This is your listing.</p>}
          </div>
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-sm">
            <p className="font-semibold">Messaging</p>
            <p className="text-foreground/70">A private thread opens automatically once you purchase. For pre-sale questions, start a chat from the listing page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
