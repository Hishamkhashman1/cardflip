import { NextResponse } from "next/server";
import { ListingStatus } from "@prisma/client";
import { z } from "zod";

import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const getSchema = z.object({
  threadId: z.string().cuid(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(25),
});

const postSchema = z.object({
  threadId: z.string().cuid().optional(),
  listingId: z.string().cuid().optional(),
  orderId: z.string().cuid().optional(),
  body: z.string().min(1).max(480),
});

type ThreadContext = {
  initiatorId: string;
  listing: { sellerId: string } | null;
  order: { buyerId: string; listing: { sellerId: string } } | null;
};

function isAllowed(thread: ThreadContext, userId: string) {
  if (thread.order) {
    return thread.order.buyerId === userId || thread.order.listing.sellerId === userId;
  }
  if (thread.listing) {
    return thread.listing.sellerId === userId || thread.initiatorId === userId;
  }
  return false;
}

export async function GET(request: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const search = getSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));

  const thread = await prisma.thread.findUnique({
    where: { id: search.threadId },
    include: {
      listing: { select: { sellerId: true } },
      order: { include: { listing: { select: { sellerId: true } } } },
    },
  });
  if (!thread || !isAllowed(thread, session.user.id)) {
    return NextResponse.json({ error: "Thread not accessible" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { threadId: thread.id },
    orderBy: { createdAt: "desc" },
    take: search.limit + 1,
    cursor: search.cursor ? { id: search.cursor } : undefined,
    skip: search.cursor ? 1 : 0,
    include: { sender: { select: { id: true, handle: true, avatarUrl: true } } },
  });

  let nextCursor: string | null = null;
  if (messages.length > search.limit) {
    const nextItem = messages.pop();
    nextCursor = nextItem!.id;
  }

  return NextResponse.json({ messages: messages.reverse(), nextCursor });
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const payload = postSchema.parse(await request.json());

  let threadId = payload.threadId;

  if (!threadId) {
    if (!payload.listingId && !payload.orderId) {
      return NextResponse.json({ error: "listingId or orderId required" }, { status: 400 });
    }

    if (payload.orderId) {
      const order = await prisma.order.findUnique({ include: { listing: true }, where: { id: payload.orderId } });
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      if (order.buyerId !== session.user.id && order.listing.sellerId !== session.user.id) {
        return NextResponse.json({ error: "Not part of this order" }, { status: 403 });
      }
      const thread = await prisma.thread.upsert({
        where: { orderId: order.id },
        create: { orderId: order.id, listingId: order.listingId, initiatorId: session.user.id },
        update: {},
      });
      threadId = thread.id;
    } else if (payload.listingId) {
      const listing = await prisma.listing.findUnique({ where: { id: payload.listingId } });
      if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      if (listing.status === ListingStatus.CANCELLED) {
        return NextResponse.json({ error: "Listing closed" }, { status: 400 });
      }
      const thread = await prisma.thread.create({
        data: {
          listingId: listing.id,
          initiatorId: session.user.id,
        },
      });
      threadId = thread.id;
    }
  }

  const thread = await prisma.thread.findUnique({
    where: { id: threadId! },
    include: {
      listing: { select: { sellerId: true } },
      order: { include: { listing: { select: { sellerId: true } } } },
    },
  });
  if (!thread || !isAllowed(thread, session.user.id)) {
    return NextResponse.json({ error: "Thread not accessible" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: session.user.id,
      body: payload.body,
    },
    include: { sender: { select: { id: true, handle: true, avatarUrl: true } } },
  });

  return NextResponse.json({ message });
}
