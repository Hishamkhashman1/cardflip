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
    <div className="mx-auto max-w-5xl space-y-6 px-4">
      <section className="panel glow-border space-y-3 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Inbox</p>
        <h1 className="text-3xl font-bold">Message center</h1>
        <p className="text-sm text-[var(--muted)]">
          Every conversation sticks to its listing or order so you keep provenance when negotiating or confirming shipping.
        </p>
      </section>
      <div className="space-y-3">
        {threads.map((thread) => {
          const lastMessage = thread.messages[0];
          const title = thread.listing?.card.title ?? thread.order?.listing.card.title ?? "Conversation";

          return (
            <Link
              key={thread.id}
              href={`/messages/${thread.id}`}
              className="panel block rounded-3xl border border-[var(--color-border)]/70 p-5 transition hover:border-[var(--color-accent-strong)]/70"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Thread</p>
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <span className="pill border-[var(--color-border)]/50 text-[0.6rem]">
                  {thread.order ? "Order" : "Listing"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {lastMessage?.body ?? "No messages yet"}
              </p>
              {lastMessage ? (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Last activity {new Date(lastMessage.createdAt).toLocaleString()}
                </p>
              ) : null}
            </Link>
          );
        })}
        {!threads.length ? (
          <p className="panel rounded-3xl border border-dashed border-[var(--color-border)]/70 p-6 text-sm text-[var(--muted)]">
            No threads yet. Start a conversation from a listing to ask pre-sale questions.
          </p>
        ) : null}
      </div>
    </div>
  );
}
