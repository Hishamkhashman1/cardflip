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
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Admin overview</h1>
        <p className="text-sm text-foreground/70">Manually review accounts, listings, and orders.</p>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] p-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="mt-4 space-y-2 text-sm">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded border border-[var(--color-border)] px-3 py-2">
              <div>
                <p className="font-medium">@{user.handle}</p>
                <p className="text-foreground/60">{user.email}</p>
              </div>
              {user.isActive ? <DeactivateButton id={user.id} type="user" /> : <span className="text-xs text-foreground/60">Inactive</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] p-4">
        <h2 className="text-xl font-semibold">Listings</h2>
        <div className="mt-4 space-y-2 text-sm">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between rounded border border-[var(--color-border)] px-3 py-2">
              <div>
                <p className="font-medium">{listing.card.title}</p>
                <p className="text-foreground/60">
                  Seller: @{listing.seller.handle} — {listing.status}
                </p>
              </div>
              {listing.status === "ACTIVE" ? <DeactivateButton id={listing.id} type="listing" /> : <span className="text-xs">{listing.status}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] p-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="mt-4 space-y-2 text-sm">
          {orders.map((order) => (
            <div key={order.id} className="rounded border border-[var(--color-border)] px-3 py-2">
              <p className="font-medium">{order.listing.card.title}</p>
              <p className="text-foreground/60">
                Buyer: @{order.buyer?.handle ?? "unknown"} / Seller: @{order.listing.seller.handle} — {order.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
