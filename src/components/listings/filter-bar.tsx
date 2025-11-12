import { CardCondition } from "@prisma/client";

interface Props {
  current: Record<string, string | undefined>;
}

const conditions = Object.values(CardCondition);
const rarities = ["Common", "Uncommon", "Rare", "Ultra Rare", "Secret"];

export function FilterBar({ current }: Props) {
  return (
    <form className="grid gap-3 rounded-lg border border-[var(--color-border)] bg-[color:var(--background)]/60 p-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6" action="/" method="GET">
      <input
        name="q"
        defaultValue={current.q ?? ""}
        placeholder="Search title or set"
        className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
      />
      <select
        name="rarity"
        defaultValue={current.rarity ?? ""}
        className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
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
        className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
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
        className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
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
        className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
      />
      <input
        name="max"
        defaultValue={current.max ?? ""}
        type="number"
        min="0"
        placeholder="Max price"
        className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-full bg-[var(--color-accent-strong)] px-4 py-2 text-sm font-semibold text-white"
      >
        Apply filters
      </button>
    </form>
  );
}
