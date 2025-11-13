"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function DeactivateButton({ id, type }: { id: string; type: "user" | "listing" }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const response = await fetch("/api/admin/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    setLoading(false);
    if (!response.ok) {
      toast.error("Unable to update");
      return;
    }
    toast.success("Updated");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded-full border border-red-400/60 px-4 py-1.5 text-xs font-semibold text-red-400 transition hover:border-red-300 disabled:opacity-60"
    >
      {loading ? "Working..." : "Deactivate"}
    </button>
  );
}
