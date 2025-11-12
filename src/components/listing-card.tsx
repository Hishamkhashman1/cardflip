import Image from "next/image";
import Link from "next/link";

import type { ListingWithCard } from "@/lib/listings";
import { formatPrice } from "@/lib/utils";

export function ListingCard({ listing }: { listing: ListingWithCard }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="pixel-frame flex flex-col rounded-lg bg-[color:var(--background)] p-3 shadow-sm transition hover:-translate-y-0.5"
    >
      <div className="aspect-video w-full overflow-hidden rounded border border-[var(--color-border)] bg-black/10">
        {listing.card.imageUrl ? (
          <Image
            src={listing.card.imageUrl}
            alt={listing.card.title}
            width={320}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-wide text-foreground/60">
            Awaiting photo
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <p className="text-xs uppercase tracking-wide text-foreground/60">{listing.card.setName}</p>
        <h3 className="text-base font-semibold">{listing.card.title}</h3>
        <p className="text-foreground/70">
          #{listing.card.number} · {listing.card.condition} · {listing.card.rarity ?? "Rarity TBD"}
        </p>
        <p className="text-lg font-black text-[var(--color-accent-strong)]">
          {formatPrice(listing.priceCents, listing.currency.toUpperCase())}
        </p>
      </div>
    </Link>
  );
}
