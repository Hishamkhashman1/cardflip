import { notFound, redirect } from "next/navigation";

import { ThreadViewer } from "@/components/thread-viewer";
import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect(`/signin?callbackUrl=/messages/${params.id}`);
  }

  const thread = await prisma.thread.findUnique({
    where: { id: params.id },
    include: {
      listing: { include: { card: true, seller: true } },
      order: { include: { listing: { include: { card: true, seller: true } }, buyer: true } },
      messages: { include: { sender: { select: { id: true, handle: true } } }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!thread) {
    notFound();
  }

  const allowed =
    thread.order
      ? thread.order.buyerId === session.user.id || thread.order.listing.sellerId === session.user.id
      : thread.listing?.sellerId === session.user.id || thread.initiatorId === session.user.id;

  if (!allowed) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-4 rounded border border-[var(--color-border)] p-4">
        <p className="text-sm uppercase tracking-[0.3em] text-foreground/60">Thread</p>
        <h1 className="text-2xl font-semibold">
          {thread.listing?.card.title ?? thread.order?.listing.card.title ?? "Conversation"}
        </h1>
      </div>
      <ThreadViewer
        threadId={thread.id}
        initialMessages={thread.messages.map((message) => ({
          id: message.id,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
          sender: message.sender,
        }))}
      />
    </div>
  );
}
