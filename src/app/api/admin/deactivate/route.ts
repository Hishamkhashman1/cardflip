import { NextResponse } from "next/server";
import { ListingStatus } from "@prisma/client";
import { z } from "zod";

import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  type: z.enum(["user", "listing"]),
  id: z.string().cuid(),
});

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = schema.parse(await request.json());

  if (payload.type === "user") {
    await prisma.user.update({ where: { id: payload.id }, data: { isActive: false } });
    return NextResponse.json({ ok: true });
  }

  await prisma.listing.update({ where: { id: payload.id }, data: { status: ListingStatus.CANCELLED } });
  return NextResponse.json({ ok: true });
}
