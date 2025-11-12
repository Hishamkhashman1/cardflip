import { NextResponse } from "next/server";
import { ListingStatus, OrderStatus } from "@prisma/client";
import { z } from "zod";

import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PLATFORM_FEE_BPS, stripe } from "@/lib/stripe";

const bodySchema = z.object({
  listingId: z.string().cuid(),
});

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const payload = bodySchema.parse(await request.json());

  const listing = await prisma.listing.findUnique({
    where: { id: payload.listingId },
    include: {
      card: true,
      seller: true,
    },
  });

  if (!listing || listing.status !== ListingStatus.ACTIVE) {
    return NextResponse.json({ error: "Listing unavailable" }, { status: 400 });
  }
  if (listing.sellerId === session.user.id) {
    return NextResponse.json({ error: "You cannot buy your own card" }, { status: 400 });
  }

  const platformFeeCents = Math.round((listing.priceCents * PLATFORM_FEE_BPS) / 10000);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        buyerId: session.user.id,
        listingId: listing.id,
        status: OrderStatus.REQUIRES_PAYMENT,
        totalCents: listing.priceCents,
        platformFeeCents,
      },
    });

    await tx.listing.update({ where: { id: listing.id }, data: { status: ListingStatus.PENDING } });

    await tx.thread.upsert({
      where: { orderId: created.id },
      update: {},
      create: { orderId: created.id, listingId: listing.id, initiatorId: session.user.id },
    });

    return created;
  });

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const successUrl = `${origin}/orders/${order.id}?success=1`;
  const cancelUrl = `${origin}/listing/${listing.id}?cancelled=1`;

  if (!stripe) {
    // Local dev fallback to keep flow unblocked when Stripe keys are missing.
    return NextResponse.json({
      checkoutUrl: `${origin}/stub/checkout?orderId=${order.id}`,
      orderId: order.id,
      notice: "Stripe not configured. Using stub checkout.",
    });
  }

  const sessionResponse = await stripe.checkout.sessions.create({
    customer_email: session.user.email ?? undefined,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: listing.currency,
          product_data: {
            name: listing.card.title,
            description: `${listing.card.setName} • ${listing.card.rarity ?? "Unknown"}`,
            images: listing.card.imageUrl ? [listing.card.imageUrl] : undefined,
          },
          unit_amount: listing.priceCents,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      listingId: listing.id,
      orderId: order.id,
    },
    payment_intent_data:
      listing.seller.stripeAccountId && process.env.STRIPE_CONNECT_PLATFORM_ACCOUNT
        ? {
            application_fee_amount: platformFeeCents,
            transfer_data: { destination: listing.seller.stripeAccountId },
          }
        : undefined,
  });

  await prisma.order.update({ where: { id: order.id }, data: { stripeCheckoutId: sessionResponse.id } });

  return NextResponse.json({ checkoutUrl: sessionResponse.url, orderId: order.id });
}
