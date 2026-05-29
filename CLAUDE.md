# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Wandercost — a social travel cost platform. Users post trip photos with real cost data (per day, stay, food, flights, total). Fully social with follows, likes, comments, DMs, and verified traveler badges. Three Stripe subscription tiers: Free, Explorer ($9/mo), Pro ($19/mo).

## Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint
npm run db:generate      # Regenerate Prisma client after schema changes
npm run db:push          # Push schema to DB without migration (dev)
npm run db:migrate       # Create and apply a named migration (prod)
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed 8 destinations
```

## Stack

- **Next.js 16** (App Router) — check `node_modules/next/dist/docs/` for API changes from older versions
- **TypeScript + Tailwind CSS v4**
- **Supabase** — Postgres + Auth + Storage + Realtime (DMs)
- **Prisma ORM** — schema at `prisma/schema.prisma`
- **Stripe** — subscriptions, webhooks
- **Cloudinary** — photo uploads (max 4 per post, auto-compress)

## Architecture

### Auth flow
Supabase Auth handles sessions. `lib/supabase/server.ts` creates a server-side client (uses `cookies()` from `next/headers`). `lib/supabase/client.ts` creates the browser client. Middleware (to be added at `middleware.ts`) refreshes sessions on every request.

### Database
Prisma sits in front of Supabase Postgres. Use `lib/prisma.ts` singleton for all DB queries. After any schema change: `npm run db:generate` then `npm run db:push` (dev) or `npm run db:migrate` (prod).

### Feed algorithm
Implemented in `lib/feed.ts`. Score = `(likes×1) + (comments×2) + (saves×3) + recency_decay`. Multipliers: verified user ×1.5, Explorer/Pro plan ×2.0, following ×1.3. `feed_score` is stored on the `posts` table and should be recalculated on like/comment/save events.

### Subscriptions
Plan limits defined in `lib/stripe.ts` (`PLANS` constant). Free: 3 posts/month, no DMs, follow limit 50. Explorer ($9): unlimited posts, DMs, 2× feed boost. Pro ($19): everything + monetize, API access, custom URL. Gate features by checking `user.plan` — never trust client-side plan state.

### Verification (3-step)
1. Government ID upload → private Supabase storage bucket
2. Selfie holding ID
3. Trip proof (boarding pass / hotel confirmation)
Admin reviews at `/admin/verify`. On approval: set `verified=true`, send email, schedule ID photo deletion within 72h. Verified badge = blue filled circle with white checkmark. Verified users get 1.5× feed boost.

### Design tokens
- Primary accent: `#1D9E75` (teal-green)
- Cards: white, `0.5px` borders, no gradients, no shadows
- Mobile-first, bottom nav on mobile
- Verified badge: blue filled circle + white checkmark

## Env setup

Copy `.env.local.example` → `.env.local` and fill in all values before running locally. Both `DATABASE_URL` (pooled, port 6543) and `DIRECT_URL` (direct, port 5432) are required by Prisma with Supabase.

## Build order (agreed with user)

1. ✅ Scaffold + Supabase schema + Prisma + seed 8 destinations
2. Auth (email + Google OAuth)
3. Profile pages
4. Post creation + Cloudinary upload
5. Feed with cost data strip
6. Likes, comments (threaded), saves
7. Follow system
8. Destination aggregate pages
9. Verification flow + admin queue
10. Stripe subscriptions + plan gating
11. Direct messages (Supabase Realtime, Explorer+ only)
12. Pro analytics dashboard
13. Mobile responsive pass
14. Deploy to Vercel
