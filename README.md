# site_aaainsper_frontend

Frontend for the Atlética Insper club-management system. Ground-up rewrite — pairs with
[site_aaainsper_backend](https://github.com/jhonatanrlp/site_aaainsper_backend).

> **Status:** in progress (Checkpoint C — app shell landed: scaffold, typed API client generated
> from the backend's OpenAPI document, auth/session, role-based layout and navigation. Feature
> screens for each role area come next.)

## Architecture

```
site_aaainsper_frontend (this repo)
        |
        +---- HTTPS REST API → site_aaainsper_backend (all application data, mutations, files)
        +---- Supabase Auth  → OTP login / session / refresh / sign-out ONLY
```

This app never queries Postgres or Storage directly, and never imports `supabase.from(...)` or
`supabase.storage` anywhere — `src/lib/supabaseAuth.ts` is deliberately scoped to `auth.*` calls
only. Every piece of application data comes from the backend API via the typed client in
`src/lib/api/client.ts`.

## Stack

- React 19 + TypeScript (strict) + Vite
- React Router — client-side routing, role-based route guards
- TanStack Query — server state
- Tailwind CSS v4 — design tokens in `src/styles/globals.css`, hand-built UI primitives in
  `src/components/ui` (not a copied component library)
- `openapi-fetch` + `openapi-typescript` — the API client is generated from the backend's live
  OpenAPI document (see [Generating the API client](#generating-the-api-client) below); this is
  what keeps the frontend from drifting out of sync with the backend, the exact failure mode the
  legacy app had
- `react-hook-form` + `zod` — forms
- Vitest + Testing Library — tests

## Getting started

```bash
npm install
cp .env.example .env   # fill in the backend URL and your Supabase project's URL/anon key
npm run dev             # http://localhost:5173 — requires the backend running locally too
```

## Generating the API client

```bash
# with site_aaainsper_backend running locally (npm run dev there, default port 3000):
npm run generate:api
```

This regenerates `src/lib/api/schema.gen.ts` from the backend's `/docs/json` OpenAPI document.
Run it whenever the backend's routes or request schemas change. The generated file is committed
(not gitignored) so the app builds without needing a live backend.

**Known limitation:** the backend currently declares OpenAPI schemas for request params/query/body
only, not response bodies (see the backend's Checkpoint B report). Response shapes are typed via
hand-kept interfaces near each API call until response schemas are added — check for a comment
explaining the cast wherever you see one.

## Environment variables

See [.env.example](.env.example). `VITE_SUPABASE_ANON_KEY` is the standard public Supabase anon
key — safe to expose client-side, it only grants what Supabase's own auth flow needs.

## Scripts

| Command                                     | Purpose                                                             |
| ------------------------------------------- | ------------------------------------------------------------------- |
| `npm run dev`                               | Start the dev server                                                |
| `npm run build`                             | Type-check + production build                                       |
| `npm run preview`                           | Preview the production build locally                                |
| `npm run typecheck`                         | `tsc -b --noEmit`                                                   |
| `npm run lint` / `lint:fix`                 | ESLint                                                              |
| `npm run format` / `format:check`           | Prettier                                                            |
| `npm test` / `test:watch` / `test:coverage` | Vitest                                                              |
| `npm run generate:api`                      | Regenerate the typed API client from the backend's OpenAPI document |

CI (`.github/workflows/ci.yml`) runs format-check, lint, typecheck, tests, and build on every
push/PR — the pipeline fails on any of these.

## Project layout

```
src/
  app/
    router/       route definitions, ProtectedRoute (role-based guard)
    layouts/      AppShell, Sidebar, Header, nav config
    providers/    QueryClientProvider, AuthProvider, BrowserRouter, Toaster
  features/       one folder per domain area (auth today; athletes/modalities/teams/
                  documents/competitions/store/dues/econo/admin land in later steps)
  components/
    ui/           hand-built primitives (Button, Badge, Avatar, DropdownMenu, …)
    feedback/     LoadingScreen, ErrorScreen, EmptyState, UnderConstructionPage
  lib/
    api/          typed client (client.ts) + generated schema (schema.gen.ts)
    supabaseAuth.ts  auth-only Supabase client
    env.ts        validated environment config
    cn.ts         className merge utility
  styles/         global CSS + design tokens
```

## Design system

Colors, spacing, and radii are defined as CSS custom properties in `src/styles/globals.css`
(Tailwind v4 `@theme`). The brand palette (deep navy + gold accent) carries over the legacy
product's visual _concept_, not its code or exact values — swap the token values there if real
brand colors/assets are provided.

## Testing

`npm test` runs Vitest + Testing Library. Critical-flow tests (login, role-gated navigation,
etc.) land in their own checkpoint step alongside the corresponding feature screens.
