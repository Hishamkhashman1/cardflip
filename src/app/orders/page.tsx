import { redirect } from "next/navigation";

import { OrderStatusForm } from "@/components/order-status-form";
import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/orders");
  }

  const [purchases, sales] = await Promise.all([
    prisma.order.findMany({
      where: { buyerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { listing: { include: { card: true } } },
    }),
    prisma.order.findMany({
      where: { listing: { sellerId: session.user.id } },
      orderBy: { createdAt: "desc" },
      include: { listing: { include: { card: true } }, buyer: { select: { handle: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-xl font-semibold">Purchases</h2>
          <div className="mt-4 space-y-4">
            {purchases.map((order) => (
              <article key={order.id} className="rounded border border-[var(--color-border)] p-4 text-sm">
                <p className="text-base font-semibold">{order.listing.card.title}</p>
                <p className="text-foreground/70">Status: {order.status}</p>
                <p className="text-foreground/70">
                  Paid: {formatPrice(order.totalCents, order.listing.currency.toUpperCase())}
                </p>
                {order.status === "SHIPPED" ? <OrderStatusForm orderId={order.id} role="buyer" /> : null}
              </article>
            ))}
            {!purchases.length ? <p className="text-sm text-foreground/60">No orders yet.</p> : null}
          </div>
        </section>
        <section className="rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-xl font-semibold">Sales</h2>
          <div className="mt-4 space-y-4">
            {sales.map((order) => (
              <article key={order.id} className="rounded border border-[var(--color-border)] p-4 text-sm">
                <p className="text-base font-semibold">{order.listing.card.title}</p>
                <p className="text-foreground/70">Buyer: @{order.buyer?.handle ?? "unknown"}</p>
                <p className="text-foreground/70">Status: {order.status}</p>
                {order.status === "PAID" || order.status === "REQUIRES_PAYMENT" ? (
                  <p className="text-xs text-foreground/60">Waiting for payment</p>
                ) : null}
                {order.status === "PAID" || order.status === "SHIPPED" ? <OrderStatusForm orderId={order.id} role="seller" /> : null}
              </article>
            ))}
            {!sales.length ? <p className="text-sm text-foreground/60">No sales yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
