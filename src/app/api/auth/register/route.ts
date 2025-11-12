import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(64),
  handle: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_]+$/i, "Only letters, numbers, and underscores"),
  name: z.string().min(1).max(60),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const { email, password, handle, name } = bodySchema.parse(payload);

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { handle }] } });
  if (existing) {
    return NextResponse.json({ error: "Email or handle already in use" }, { status: 400 });
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      handle,
      name,
      passwordHash,
    },
  });

  return NextResponse.json({ ok: true });
}
