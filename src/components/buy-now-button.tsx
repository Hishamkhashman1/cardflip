"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function BuyNowButton({ listingId, disabled }: { listingId: string; disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const response = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    setLoading(false);
    if (!response.ok) {
      const body = await response.json();
      toast.error(body.error ?? "Unable to start checkout");
      return;
    }
    const data = await response.json();
    if (data.checkoutUrl) {
      router.push(data.checkoutUrl);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleCheckout}
      className="w-full rounded-full bg-[var(--color-accent)] px-4 py-3 text-base font-semibold text-foreground"
    >
      {loading ? "Redirecting..." : "Buy with Stripe"}
    </button>
  );
}
