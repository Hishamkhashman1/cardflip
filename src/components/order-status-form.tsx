"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function OrderStatusForm({ orderId, role }: { orderId: string; role: "buyer" | "seller" }) {
  const [form, setForm] = useState({ shippingCarrier: "", trackingNumber: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const status = role === "seller" ? "SHIPPED" : "DELIVERED";
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...form }),
    });
    setLoading(false);
    if (!response.ok) {
      const body = await response.json();
      toast.error(body.error ?? "Unable to update order");
      return;
    }
    toast.success("Order updated");
  }

  return (
    <form className="space-y-3 rounded-2xl border border-[var(--color-border)]/70 bg-[color:var(--background)]/50 p-4" onSubmit={handleSubmit}>
      {role === "seller" ? (
        <>
          <input
            placeholder="Shipping carrier"
            className="w-full rounded-xl border border-[var(--color-border)]/70 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-strong)]"
            value={form.shippingCarrier}
            onChange={(event) => setForm((prev) => ({ ...prev, shippingCarrier: event.target.value }))}
          />
          <input
            placeholder="Tracking number"
            className="w-full rounded-xl border border-[var(--color-border)]/70 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-strong)]"
            value={form.trackingNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, trackingNumber: event.target.value }))}
          />
        </>
      ) : (
        <p className="text-xs text-[var(--muted)]">
          Confirm delivery to release payouts to the seller once the card has arrived safely.
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--color-accent-strong)]/90 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Saving..." : role === "seller" ? "Mark shipped" : "Confirm delivery"}
      </button>
    </form>
  );
}
