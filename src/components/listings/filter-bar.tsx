import { CardCondition } from "@prisma/client";

import { cn } from "@/lib/utils";

interface Props {
  current: Record<string, string | undefined>;
  className?: string;
}

const conditions = Object.values(CardCondition);
const rarities = ["Common", "Uncommon", "Rare", "Ultra Rare", "Secret"];

export function FilterBar({ current, className }: Props) {
  return (
    <form
      action="/"
      method="GET"
      className={cn(
        "panel grid gap-3 rounded-2xl border border-[var(--color-border)]/60 bg-[color:var(--background-alt)]/70 p-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
        className
      )}
    >
      <input
        name="q"
        defaultValue={current.q ?? ""}
        placeholder="Search title or set"
        className="rounded-xl border border-[var(--color-border)]/60 bg-transparent px-3 py-2 text-sm focus:border-[var(--color-accent-strong)] focus:outline-none"
      />
      <select
        name="rarity"
        defaultValue={current.rarity ?? ""}
        className="rounded-xl border border-[var(--color-border)]/60 bg-transparent px-3 py-2 text-sm focus:border-[var(--color-accent-strong)] focus:outline-none"
      >
        <option value="">Any rarity</option>
        {rarities.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        name="condition"
        defaultValue={current.condition ?? ""}
        className="rounded-xl border border-[var(--color-border)]/60 bg-transparent px-3 py-2 text-sm focus:border-[var(--color-accent-strong)] focus:outline-none"
      >
        <option value="">Any condition</option>
        {conditions.map((condition) => (
          <option key={condition} value={condition}>
            {condition}
          </option>
        ))}
      </select>
      <select
        name="sort"
        defaultValue={current.sort ?? "newest"}
        className="rounded-xl border border-[var(--color-border)]/60 bg-transparent px-3 py-2 text-sm focus:border-[var(--color-accent-strong)] focus:outline-none"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
      </select>
      <input
        name="min"
        defaultValue={current.min ?? ""}
        type="number"
        min="0"
        placeholder="Min price"
        className="rounded-xl border border-[var(--color-border)]/60 bg-transparent px-3 py-2 text-sm focus:border-[var(--color-accent-strong)] focus:outline-none"
      />
      <input
        name="max"
        defaultValue={current.max ?? ""}
        type="number"
        min="0"
        placeholder="Max price"
        className="rounded-xl border border-[var(--color-border)]/60 bg-transparent px-3 py-2 text-sm focus:border-[var(--color-accent-strong)] focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-2xl bg-[var(--color-accent-strong)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:col-span-2 md:col-span-4 lg:col-span-1"
      >
        Apply filters
      </button>
    </form>
  );
}
