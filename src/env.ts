import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .default("postgresql://cardflip:cardflip@localhost:5432/cardflip"),
  NEXTAUTH_SECRET: z.string().default("cardflip-dev-secret"),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_CONNECT_PLATFORM_ACCOUNT: z.string().optional(),
  STRIPE_CONNECT_CLIENT_ID: z.string().optional(),
  UPLOADTHING_TOKEN: z.string().optional(),
  PLATFORM_FEE_BPS: z.coerce.number().default(750),
  FEATURE_CARD_PROVIDER: z.coerce.boolean().default(false),
  PROVIDER_API_KEY: z.string().optional(),
  PROVIDER_BASE_URL: z.string().optional(),
  CONTENT_SAFETY_BLOCKLIST: z.string().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_CONNECT_PLATFORM_ACCOUNT: process.env.STRIPE_CONNECT_PLATFORM_ACCOUNT,
  STRIPE_CONNECT_CLIENT_ID: process.env.STRIPE_CONNECT_CLIENT_ID,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  PLATFORM_FEE_BPS: process.env.PLATFORM_FEE_BPS,
  FEATURE_CARD_PROVIDER: process.env.FEATURE_CARD_PROVIDER,
  PROVIDER_API_KEY: process.env.PROVIDER_API_KEY,
  PROVIDER_BASE_URL: process.env.PROVIDER_BASE_URL,
  CONTENT_SAFETY_BLOCKLIST: process.env.CONTENT_SAFETY_BLOCKLIST,
});
