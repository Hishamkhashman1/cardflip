import { env } from "@/env";
import type { CardDataProvider, RarityLookupInput, RarityLookupResult } from "../types";

const DEFAULT_BASE_URL = "https://api.pokemontcg.io/v2";

export class PokemonTcgAdapter implements CardDataProvider {
  constructor(private config: { apiKey?: string | null; baseUrl?: string | null }) {}

  isEnabled() {
    return Boolean(env.FEATURE_CARD_PROVIDER);
  }

  async lookupRarity({ setName, number }: RarityLookupInput): Promise<RarityLookupResult> {
    const params = new URLSearchParams();
    // API expects encoded query; keep generic strings to avoid storing franchised names anywhere else.
    params.set("q", `set.name:\"${setName}\" number:${number}`);
    const url = `${this.config.baseUrl ?? DEFAULT_BASE_URL}/cards?${params.toString()}`;

    const response = await fetch(url, {
      headers: this.config.apiKey ? { "X-Api-Key": this.config.apiKey } : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        rarity: null,
        source: "pokemontcg.io",
        disclaimer: "Third-party data unavailable (DEV only).",
      };
    }

    const payload = (await response.json()) as { data?: Array<{ rarity?: string | null }> };
    const rarity = payload.data?.[0]?.rarity ?? null;
    return {
      rarity,
      source: "pokemontcg.io",
      disclaimer: "Card data provided for developer testing only. Disable in production.",
    };
  }
}
