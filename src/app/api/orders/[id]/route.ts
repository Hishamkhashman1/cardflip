import { NextResponse } from "next/server";
import { ListingStatus, OrderStatus } from "@prisma/client";
import { z } from "zod";

import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.nativeEnum(OrderStatus),
  shippingCarrier: z.string().optional(),
  trackingNumber: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const payload = schema.parse(await request.json());
  const order = await prisma.order.findUnique({ include: { listing: true }, where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (payload.status === OrderStatus.SHIPPED && order.listing.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Only the seller can mark shipped" }, { status: 403 });
  }

  if (payload.status === OrderStatus.DELIVERED && order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Only the buyer can confirm delivery" }, { status: 403 });
  }

  if (![OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(payload.status)) {
    return NextResponse.json({ error: "Unsupported status" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: payload.status,
      shippingCarrier: payload.shippingCarrier ?? order.shippingCarrier,
      trackingNumber: payload.trackingNumber ?? order.trackingNumber,
    },
  });

  if (payload.status === OrderStatus.DELIVERED) {
    await prisma.listing.update({ where: { id: order.listingId }, data: { status: ListingStatus.SOLD } });
  }

  return NextResponse.json({ order: updated });
}
