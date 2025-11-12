import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerAuthSession();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, listings, orders] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true, handle: true, role: true, createdAt: true } }),
    prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { card: true, seller: { select: { id: true, handle: true } } },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { listing: { include: { card: true, seller: true } }, buyer: { select: { id: true, handle: true } } },
    }),
  ]);

  return NextResponse.json({ users, listings, orders });
}
