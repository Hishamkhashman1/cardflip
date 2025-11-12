import { CardCondition, ListingStatus, type Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const listingFiltersSchema = z.object({
  q: z.string().optional(),
  rarity: z.string().optional(),
  condition: z.nativeEnum(CardCondition).optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  sort: z.enum(["price-asc", "price-desc", "newest"]).default("newest"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(12),
});

const listingSelect = {
  id: true,
  priceCents: true,
  currency: true,
  status: true,
  createdAt: true,
  card: {
    select: {
      id: true,
      title: true,
      rarity: true,
      condition: true,
      setName: true,
      number: true,
      imageUrl: true,
      language: true,
    },
  },
  seller: {
    select: {
      id: true,
      handle: true,
      avatarUrl: true,
      name: true,
    },
  },
} satisfies Prisma.ListingSelect;

export type ListingWithCard = Prisma.ListingGetPayload<{ select: typeof listingSelect }>;

export async function listPublicListings(query: z.infer<typeof listingFiltersSchema>) {
  const filters = listingFiltersSchema.parse(query);
  const where: Prisma.ListingWhereInput = {
    status: ListingStatus.ACTIVE,
    seller: { isActive: true },
  };

  if (filters.q) {
    where.OR = [
      { card: { title: { contains: filters.q, mode: "insensitive" } } },
      { card: { setName: { contains: filters.q, mode: "insensitive" } } },
    ];
  }
  if (filters.rarity) {
    where.card = { ...(where.card ?? {}), rarity: { equals: filters.rarity } };
  }
  if (filters.condition) {
    where.card = { ...(where.card ?? {}), condition: filters.condition };
  }
  if (filters.min || filters.max) {
    where.priceCents = {
      ...(filters.min ? { gte: filters.min } : {}),
      ...(filters.max ? { lte: filters.max } : {}),
    };
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput[] = [];
  if (filters.sort === "price-asc") orderBy.push({ priceCents: "asc" });
  if (filters.sort === "price-desc") orderBy.push({ priceCents: "desc" });
  if (!orderBy.length || filters.sort === "newest") orderBy.push({ createdAt: "desc" });

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    select: listingSelect,
    take: filters.limit + 1,
    skip: filters.cursor ? 1 : 0,
    cursor: filters.cursor ? { id: filters.cursor } : undefined,
  });

  let nextCursor: string | null = null;
  if (listings.length > filters.limit) {
    const nextItem = listings.pop();
    nextCursor = nextItem!.id;
  }

  return { listings, nextCursor };
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      card: true,
      seller: {
        select: {
          id: true,
          handle: true,
          avatarUrl: true,
          name: true,
        },
      },
    },
  });
}
