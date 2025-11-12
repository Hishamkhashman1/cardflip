import { env } from "@/env";
import type { CardDataProvider } from "./types";
import { PokemonTcgAdapter } from "./adapters/pokemon";

let cached: CardDataProvider | null | undefined;

export function getCardDataProvider(): CardDataProvider | null {
  if (cached !== undefined) {
    return cached;
  }

  if (!env.FEATURE_CARD_PROVIDER) {
    cached = null;
    return cached;
  }

  cached = new PokemonTcgAdapter({
    apiKey: env.PROVIDER_API_KEY,
    baseUrl: env.PROVIDER_BASE_URL,
  });
  return cached;
}
