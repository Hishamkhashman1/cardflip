"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { CardImageUpload } from "@/components/card-image-upload";

type FormValues = {
  title: string;
  setName: string;
  number: string;
  rarity?: string;
  condition: string;
  language: string;
  price: number;
  ownsRights: boolean;
};

const conditions = ["NM", "LP", "MP", "HP", "DMG"];

export function ListingForm({ platformFeeBps }: { platformFeeBps: number }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      condition: "NM",
      language: "English",
      price: 25,
      ownsRights: false,
    },
  });

  const watchPrice = form.watch("price") ?? 0;
  const platformFee = Math.round(watchPrice * 100 * (platformFeeBps / 10000)) / 100;

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const cardResponse = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          rarity: values.rarity?.trim() || undefined,
          price: undefined,
          imageUrl,
          ownsRights: values.ownsRights,
        }),
      });

      if (!cardResponse.ok) {
        throw new Error((await cardResponse.json()).error ?? "Failed to create card");
      }
      const { card } = await cardResponse.json();

      const listingResponse = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, priceCents: Math.round(values.price * 100) }),
      });
      if (!listingResponse.ok) {
        throw new Error((await listingResponse.json()).error ?? "Failed to create listing");
      }
      toast.success("Listing published");
      const { listing } = await listingResponse.json();
      router.push(`/listing/${listing.id}`);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function suggestRarity() {
    const setName = form.getValues("setName");
    const number = form.getValues("number");
    if (!setName || !number) {
      toast.error("Add set name and number first");
      return;
    }
    const response = await fetch("/api/suggest/rarity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setName, number }),
    });
    if (!response.ok) {
      toast.error("Provider unavailable");
      return;
    }
    const data = await response.json();
    if (data.rarity) {
      form.setValue("rarity", data.rarity);
      toast.success(`Suggested rarity: ${data.rarity}`);
    } else {
      toast("No data found (third-party)");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Title</span>
            <input
              {...form.register("title", { required: true })}
              className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
              placeholder="Crystal Golem #01"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Set name</span>
            <input
              {...form.register("setName", { required: true })}
              className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
              placeholder="Vaporwave Creatures"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Card number</span>
            <input
              {...form.register("number", { required: true })}
              className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
              placeholder="001"
            />
          </label>
          <div className="space-y-2 text-sm">
            <label className="font-medium">Rarity</label>
            <div className="flex gap-2">
              <input
                {...form.register("rarity")}
                className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
                placeholder="Mythic"
              />
              <button type="button" className="rounded border border-[var(--color-border)] px-3" onClick={suggestRarity}>
                Suggest
              </button>
            </div>
            <p className="text-xs text-foreground/60">Third-party data for dev use only.</p>
          </div>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Condition</span>
            <select
              {...form.register("condition")}
              className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Language</span>
            <input
              {...form.register("language", { required: true })}
              className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
              placeholder="English"
            />
          </label>
        </div>

        <CardImageUpload value={imageUrl} onChange={setImageUrl} />

        <label className="space-y-1 text-sm">
          <span className="font-medium">Listing price (USD)</span>
          <input
            type="number"
            step="0.5"
            min="1"
            {...form.register("price", { valueAsNumber: true })}
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
          />
        </label>
        <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[color:var(--background)]/60 p-4 text-sm">
          <p>
            Platform keeps <strong>{platformFeeBps / 100}%</strong> ({platformFee.toFixed(2)} USD). You receive the rest automatically via Stripe Connect.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("ownsRights", { required: true })} />
          I own the rights to upload this image and it contains no third-party IP.
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--color-accent-strong)] px-4 py-3 text-base font-semibold text-white"
        >
          {loading ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
