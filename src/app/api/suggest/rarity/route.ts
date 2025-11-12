import { NextResponse } from "next/server";
import { z } from "zod";

import { getCardDataProvider } from "@/lib/card-provider/provider";

const bodySchema = z.object({
  setName: z.string().min(2),
  number: z.string().min(1),
});

export async function POST(request: Request) {
  const provider = getCardDataProvider();
  if (!provider) {
    return NextResponse.json({ rarity: null, source: "disabled" });
  }

  const payload = bodySchema.parse(await request.json());

  try {
    const result = await provider.lookupRarity(payload);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { rarity: null, source: "provider-error", disclaimer: "Rarity lookups unavailable" },
      { status: 503 }
    );
  }
}
