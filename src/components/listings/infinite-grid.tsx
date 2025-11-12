"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { ListingCard } from "@/components/listing-card";
import type { ListingWithCard } from "@/lib/listings";

interface Props {
  initialListings: ListingWithCard[];
  initialCursor: string | null;
  filters: Record<string, string | undefined>;
}

export function ListingsInfiniteGrid({ initialListings, initialCursor, filters }: Props) {
  const serializeFilters = (cursor?: string | null) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (cursor) params.set("cursor", cursor);
    return params.toString();
  };

  const query = useInfiniteQuery({
    queryKey: ["listings", filters],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`/api/listings?${serializeFilters(pageParam as string | undefined)}`);
      if (!response.ok) throw new Error("Failed to load listings");
      return (await response.json()) as { listings: ListingWithCard[]; nextCursor: string | null };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null,
    initialData: {
      pages: [{ listings: initialListings, nextCursor: initialCursor }],
      pageParams: [null],
    },
  });

  const listings = useMemo(
    () => query.data?.pages.flatMap((page) => page.listings) ?? [],
    [query.data]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      {query.hasNextPage ? (
        <button
          type="button"
          className="w-full rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold"
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {query.isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      ) : (
        <p className="text-center text-sm text-foreground/60">No more listings yet.</p>
      )}
    </div>
  );
}
