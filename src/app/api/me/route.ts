import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      handle: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      role: true,
      listings: { select: { id: true, status: true } },
      orders: { select: { id: true, status: true } },
      reviewsReceived: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { listings, orders, reviewsReceived, ...rest } = user;
  const ratingSummary = reviewsReceived.length
    ? reviewsReceived.reduce((acc, review) => acc + review.rating, 0) / reviewsReceived.length
    : null;

  return NextResponse.json({
    user: {
      ...rest,
      reviewAverage: ratingSummary,
    },
    stats: {
      activeListings: listings.filter((l) => l.status === "ACTIVE").length,
      completedSales: listings.filter((l) => l.status === "SOLD").length,
      purchases: orders.length,
    },
  });
}
