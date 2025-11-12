import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/messages");
  }

  const threads = await prisma.thread.findMany({
    where: {
      OR: [
        { initiatorId: session.user.id },
        { listing: { sellerId: session.user.id } },
        { order: { buyerId: session.user.id } },
      ],
    },
    include: {
      listing: { select: { card: { select: { title: true } } } },
      order: { include: { listing: { select: { card: { select: { title: true } } } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Messages</h1>
      <div className="mt-6 space-y-3">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/messages/${thread.id}`}
            className="block rounded border border-[var(--color-border)] p-4"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-foreground/60">{thread.listing?.card.title ?? thread.order?.listing.card.title}</p>
            <p className="text-sm text-foreground/70">{thread.messages[0]?.body ?? "No messages yet"}</p>
          </Link>
        ))}
        {!threads.length ? <p className="text-sm text-foreground/60">No threads yet.</p> : null}
      </div>
    </div>
  );
}
