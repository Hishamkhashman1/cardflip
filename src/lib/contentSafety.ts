const DEFAULT_BLOCKLIST = ["pokemon", "pikachu", "nintendo", "pokémon", "pokeball"];

export function titlePassesContentPolicy(title: string): boolean {
  const normalized = title.toLowerCase();
  return !getBlocklist().some((term) => normalized.includes(term));
}

export function getBlocklist() {
  const envTerms = process.env.CONTENT_SAFETY_BLOCKLIST?.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean) ?? [];
  return Array.from(new Set([...DEFAULT_BLOCKLIST, ...envTerms]));
}

export function assertSafeTitle(title: string) {
  if (!titlePassesContentPolicy(title)) {
    throw new Error("Titles cannot reference trademarked terms. Please use generic descriptions.");
  }
}
