import { NextResponse } from "next/server";
import { ListingStatus } from "@prisma/client";
import { z } from "zod";

import { getServerAuthSession } from "@/lib/auth/session";
import { listPublicListings, listingFiltersSchema } from "@/lib/listings";
import { prisma } from "@/lib/prisma";

const createListingSchema = z.object({
  cardId: z.string().cuid(),
  priceCents: z.coerce.number().int().min(100),
  currency: z.string().default("USD"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = listingFiltersSchema.parse(Object.fromEntries(searchParams.entries()));
  const result = await listPublicListings(filters);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json();
  const payload = createListingSchema.parse(body);

  const card = await prisma.card.findUnique({ where: { id: payload.cardId } });
  if (!card || card.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const existing = await prisma.listing.findFirst({ where: { cardId: payload.cardId } });
  if (existing) {
    return NextResponse.json({ error: "Card already listed" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      cardId: payload.cardId,
      sellerId: session.user.id,
      priceCents: payload.priceCents,
      currency: payload.currency.toLowerCase(),
      status: ListingStatus.ACTIVE,
    },
    include: {
      card: true,
    },
  });

  return NextResponse.json({ listing });
}
