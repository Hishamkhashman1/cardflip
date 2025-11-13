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

  const totalSpend = purchases.reduce((sum, order) => sum + order.totalCents, 0);
  const totalSales = sales.reduce((sum, order) => sum + order.totalCents, 0);
  const openSales = sales.filter((order) => !["DELIVERED", "REFUNDED", "CANCELLED"].includes(order.status)).length;

  const renderStatus = (status: string) => status.replace("_", " ").toLowerCase();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <section className="panel glow-border space-y-4 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Orders</p>
        <h1 className="text-3xl font-bold">Track your purchases & sales</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-border)]/50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Total spent</p>
            <p className="text-2xl font-black">{formatPrice(totalSpend, "USD")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)]/50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Sales revenue</p>
            <p className="text-2xl font-black text-[var(--color-accent-strong)]">{formatPrice(totalSales, "USD")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)]/50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Open sales</p>
            <p className="text-2xl font-black">{openSales}</p>
          </div>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Purchases</p>
              <h2 className="text-xl font-semibold">Cards you&apos;ve bought</h2>
            </div>
            <span className="pill border-[var(--color-border)]/60 text-[0.6rem]">{purchases.length} orders</span>
          </div>
          <div className="mt-4 space-y-4">
            {purchases.map((order) => (
              <article key={order.id} className="rounded-2xl border border-[var(--color-border)]/60 bg-[color:var(--background-alt)]/50 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[color:var(--color-foreground)]">{order.listing.card.title}</p>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--muted)]">{order.listing.card.setName}</p>
                  </div>
                  <span className="pill border-[var(--color-border)]/50 text-[var(--color-foreground)]">
                    {renderStatus(order.status)}
                  </span>
                </div>
                <p className="mt-3 text-[var(--muted)]">
                  Paid: {formatPrice(order.totalCents, order.listing.currency.toUpperCase())}
                </p>
                {order.status === "SHIPPED" ? (
                  <div className="mt-3">
                    <OrderStatusForm orderId={order.id} role="buyer" />
                  </div>
                ) : null}
              </article>
            ))}
            {!purchases.length ? <p className="rounded-2xl border border-dashed border-[var(--color-border)]/60 p-6 text-sm text-[var(--muted)]">No purchases yet.</p> : null}
          </div>
        </section>
        <section className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Sales</p>
              <h2 className="text-xl font-semibold">Orders to fulfill</h2>
            </div>
            <span className="pill border-[var(--color-border)]/60 text-[0.6rem]">{sales.length} orders</span>
          </div>
          <div className="mt-4 space-y-4">
            {sales.map((order) => (
              <article key={order.id} className="rounded-2xl border border-[var(--color-border)]/60 bg-[color:var(--background-alt)]/45 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[color:var(--color-foreground)]">{order.listing.card.title}</p>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--muted)]">Buyer @{order.buyer?.handle ?? "unknown"}</p>
                  </div>
                  <span className="pill border-[var(--color-border)]/50 text-[var(--color-foreground)]">
                    {renderStatus(order.status)}
                  </span>
                </div>
                {order.status === "PAID" || order.status === "REQUIRES_PAYMENT" ? (
                  <p className="mt-3 text-xs text-[var(--muted)]">Waiting for payment confirmation</p>
                ) : null}
                {order.status === "PAID" || order.status === "SHIPPED" ? (
                  <div className="mt-3">
                    <OrderStatusForm orderId={order.id} role="seller" />
                  </div>
                ) : null}
              </article>
            ))}
            {!sales.length ? <p className="rounded-2xl border border-dashed border-[var(--color-border)]/60 p-6 text-sm text-[var(--muted)]">No sales yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
