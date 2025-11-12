import { NextResponse } from "next/server";
import { CardCondition } from "@prisma/client";
import { z } from "zod";

import { getServerAuthSession } from "@/lib/auth/session";
import { assertSafeTitle } from "@/lib/contentSafety";
import { prisma } from "@/lib/prisma";

const cardSchema = z.object({
  title: z.string().min(3).max(80),
  setName: z.string().min(2).max(80),
  number: z.string().min(1).max(20),
  rarity: z.string().optional().nullable(),
  condition: z.nativeEnum(CardCondition),
  language: z.string().min(2).max(20),
  imageUrl: z.string().url(),
  ownsRights: z.boolean().refine((val) => val === true, "You must confirm you own the rights to this image"),
});

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const payload = cardSchema.parse(await request.json());
  assertSafeTitle(payload.title);

  const card = await prisma.card.create({
    data: {
      ownerId: session.user.id,
      title: payload.title,
      setName: payload.setName,
      number: payload.number,
      rarity: payload.rarity ?? null,
      condition: payload.condition,
      language: payload.language,
      imageUrl: payload.imageUrl,
    },
  });

  return NextResponse.json({ card });
}
