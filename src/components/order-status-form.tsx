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
    <form className="space-y-2" onSubmit={handleSubmit}>
      {role === "seller" ? (
        <>
          <input
            placeholder="Carrier"
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-2 py-1 text-sm"
            value={form.shippingCarrier}
            onChange={(event) => setForm((prev) => ({ ...prev, shippingCarrier: event.target.value }))}
          />
          <input
            placeholder="Tracking #"
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-2 py-1 text-sm"
            value={form.trackingNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, trackingNumber: event.target.value }))}
          />
        </>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded border border-[var(--color-border)] px-3 py-2 text-sm"
      >
        {loading ? "Saving..." : role === "seller" ? "Mark shipped" : "Confirm delivery"}
      </button>
    </form>
  );
}
