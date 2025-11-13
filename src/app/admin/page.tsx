import { redirect } from "next/navigation";

import { DeactivateButton } from "@/components/deactivate-button";
import { getServerAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerAuthSession();
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const [users, listings, orders] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.listing.findMany({ include: { card: true, seller: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.order.findMany({ include: { listing: { include: { card: true, seller: true } }, buyer: true }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <section className="panel glow-border rounded-3xl border border-[var(--color-border)]/70 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Admin</p>
        <h1 className="text-3xl font-bold">Moderator cockpit</h1>
        <p className="text-sm text-[var(--muted)]">
          Review recent users, listings, and orders. Deactivate anything that breaks the content policy with one click.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Users", value: users.length },
            { label: "Listings", value: listings.length },
            { label: "Orders", value: orders.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[var(--color-border)]/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest users</h2>
          <span className="pill border-[var(--color-border)]/60 text-[0.6rem]">Manual controls</span>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          {users.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)]/60 px-4 py-3">
              <div>
                <p className="font-semibold">@{user.handle}</p>
                <p className="text-[var(--muted)]">{user.email}</p>
              </div>
              {user.isActive ? <DeactivateButton id={user.id} type="user" /> : <span className="text-xs text-[var(--muted)]">Inactive</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
        <h2 className="text-xl font-semibold">Listings</h2>
        <div className="mt-4 space-y-3 text-sm">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)]/60 px-4 py-3">
              <div>
                <p className="font-semibold">{listing.card.title}</p>
                <p className="text-[var(--muted)]">
                  Seller: @{listing.seller.handle} — {listing.status}
                </p>
              </div>
              {listing.status === "ACTIVE" ? <DeactivateButton id={listing.id} type="listing" /> : <span className="text-xs uppercase tracking-[0.3em]">{listing.status}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="panel rounded-3xl border border-[var(--color-border)]/70 p-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="mt-4 space-y-3 text-sm">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-[var(--color-border)]/60 px-4 py-3">
              <p className="font-semibold">{order.listing.card.title}</p>
              <p className="text-[var(--muted)]">
                Buyer: @{order.buyer?.handle ?? "unknown"} / Seller: @{order.listing.seller.handle} — {order.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
