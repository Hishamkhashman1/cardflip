export type RarityLookupInput = {
  setName: string;
  number: string;
};

export type RarityLookupResult = {
  rarity: string | null;
  source: string;
  disclaimer: string;
};

export interface CardDataProvider {
  isEnabled(): boolean;
  lookupRarity(params: RarityLookupInput): Promise<RarityLookupResult>;
}
