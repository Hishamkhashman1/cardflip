# CardFlip

CardFlip is an MVP marketplace built with Next.js 14 App Router for trading original creature cards. It implements email/password + Google auth, Prisma/PostgreSQL, Stripe Checkout + Connect stubs, UploadThing for image uploads, messaging threads, and an admin panel.

## Stack

- Next.js 14 (App Router) + React Server Components
- TypeScript + Tailwind CSS v4 + Headless UI
- Prisma ORM with PostgreSQL
- NextAuth (credentials + optional Google OAuth)
- Stripe Checkout & Connect Standard (sandbox)
- UploadThing for card image uploads
- React Query + React Hook Form + Zod validation

## Getting started

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000 and sign up. Seed users exist (password `password123`).

### Docker (optional)

```bash
docker compose up --build
```

This starts Postgres + the web app. Update `.env` with the compose database URL.

## Environment variables

Key vars (see `.env.example`):

- `DATABASE_URL` – Postgres connection
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (optional OAuth)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_CONNECT_PLATFORM_ACCOUNT`, `STRIPE_CONNECT_CLIENT_ID`, `STRIPE_WEBHOOK_SECRET`
- `PLATFORM_FEE_BPS` (defaults 750 → 7.5%)
- `FEATURE_CARD_PROVIDER` + `PROVIDER_API_KEY`/`PROVIDER_BASE_URL` for the pokemontcg.io adapter (dev metadata only)
- `UPLOADTHING_TOKEN` for card uploads

## Scripts

- `npm run dev` – start Next.js
- `npm run build` / `npm start`
- `npm run lint`, `npm run lint:fix`, `npm run format`
- `npm run db:push` / `npm run db:migrate`
- `npm run db:seed`
- `npm run test:e2e` – Playwright scaffold

## Features

- Public catalog with search/filter and infinite scroll (React Query)
- Listing flow with UploadThing, rarity suggestions, fee preview, & IP ownership checkbox
- Checkout flow hitting `/api/checkout/session` (Stripe if configured, stub otherwise)
- Orders dashboard for buyers/sellers, manual shipping + delivery confirmations
- Messaging threads tied to listings/orders
- Profile pages with ratings + history
- Admin view with user/listing moderation and content safety blocklist
- Content policy + terms pages ensuring no trademarked names/logos

## Tests

Playwright scaffolding lives in `tests/`. Add credentials via env vars before running `npm run test:e2e`.

## TODO (next iteration)

- Escrow shipping labels + fulfillment tracking UI
- Dispute workflow w/ evidence upload & refunds
- Stripe webhook handler to move orders from `REQUIRES_PAYMENT` → `PAID`
- Rich notifications + email digests
