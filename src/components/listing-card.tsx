import Image from "next/image";
import Link from "next/link";

import type { ListingWithCard } from "@/lib/listings";
import { cn, formatPrice } from "@/lib/utils";

export function ListingCard({ listing }: { listing: ListingWithCard }) {
  const rarityLabel = listing.card.rarity ?? "Rarity TBD";
  const statusPill = listing.status === "ACTIVE" ? "Available" : listing.status.toLowerCase();

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[color:var(--color-surface)] p-3 transition hover:-translate-y-1 hover:border-[var(--color-accent-strong)]/80"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-black/10">
        {listing.card.imageUrl ? (
          <Image
            src={listing.card.imageUrl}
            alt={listing.card.title}
            width={320}
            height={240}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">
            Awaiting photo
          </div>
        )}
        <span className="pill absolute left-3 top-3 border border-white/40 bg-white/20 text-[0.55rem] text-white">
          {statusPill}
        </span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="space-y-1 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{listing.card.setName}</p>
          <h3 className="text-base font-semibold leading-tight">{listing.card.title}</h3>
          <p className="text-xs text-[var(--muted)]">
            #{listing.card.number} &middot; {listing.card.condition} &middot; {rarityLabel}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">Price</p>
            <p className="text-lg font-black text-[var(--color-accent-strong)]">
              {formatPrice(listing.priceCents, listing.currency.toUpperCase())}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">Seller</p>
            <p className="font-semibold text-[color:var(--color-foreground)]">@{listing.seller.handle ?? "collector"}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {["NM", "LP", "MP", "HP", "DMG"].map((condition) => (
            <span
              key={condition}
              className={cn(
                "rounded-full px-2 py-1",
                condition === listing.card.condition
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-foreground)]"
                  : "bg-transparent border border-transparent"
              )}
            >
              {condition}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
