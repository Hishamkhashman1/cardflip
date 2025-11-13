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
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <div className="grid gap-6 lg:grid-cols-[1.4fr,0.9fr]">
        <div className="panel overflow-hidden p-0">
          {listing.card.imageUrl ? (
            <Image
              src={listing.card.imageUrl}
              alt={listing.card.title}
              width={1200}
              height={900}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="aspect-[4/3] w-full rounded-3xl bg-[var(--color-border)]/40" />
          )}
        </div>
        <div className="space-y-4">
          <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">{listing.card.setName}</p>
                <h1 className="mt-2 text-3xl font-bold leading-tight">{listing.card.title}</h1>
              </div>
              <span className="pill border-[var(--color-border)]/60 text-[0.55rem]">
                #{listing.card.number}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">Price</p>
                <p className="text-3xl font-black text-[var(--color-accent-strong)]">
                  {formatPrice(listing.priceCents, listing.currency.toUpperCase())}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">Condition</p>
                <p className="text-lg font-semibold">{listing.card.condition}</p>
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">Rarity</p>
                <p className="text-lg font-semibold">{listing.card.rarity ?? "TBD"}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Seller</p>
                  <p className="text-lg font-semibold">@{listing.seller.handle}</p>
                </div>
                <div className="text-right text-xs text-[var(--muted)]">
                  Listing created {new Date(listing.createdAt).toLocaleDateString()}
                </div>
              </div>
              {!isOwner ? (
                <BuyNowButton listingId={listing.id} />
              ) : (
                <p className="rounded-xl border border-[var(--color-border)]/60 px-4 py-3 text-sm text-[var(--muted)]">
                  This is your listing. Buyers will contact you via messaging once they purchase.
                </p>
              )}
            </div>
          </div>
          <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Card details</p>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              {[
                { label: "Set", value: listing.card.setName },
                { label: "Language", value: listing.card.language },
                { label: "Condition", value: listing.card.condition },
                { label: "Rarity", value: listing.card.rarity ?? "TBD" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-[var(--muted)]">{item.label}</dt>
                  <dd className="font-semibold text-[color:var(--color-foreground)]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Buyer protection</p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>• Secure checkout via Stripe – the platform fee is calculated automatically.</li>
            <li>• Dedicated thread opens when you pay so shipping + tracking stay in one place.</li>
            <li>• Mark delivery directly inside Orders to release funds to the seller.</li>
          </ul>
        </div>
        <div className="panel rounded-3xl border border-[var(--color-border)]/70 p-6 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Messaging</p>
          <p className="mt-3 text-[var(--muted)]">
            A private thread opens automatically once you purchase. For pre-sale questions, start a chat from this listing and the conversation will follow your order if you buy.
          </p>
        </div>
      </div>
    </div>
  );
}
