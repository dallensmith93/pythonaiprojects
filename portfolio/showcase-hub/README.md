# Showcase Hub

Frontend hub that lists every app in `/apps` with search, tag filtering, sorting, and quick actions for Live Demo + Repo Path.

## Stack
- Next.js (App Router)
- React + TypeScript
- CSS (no heavy UI library)
- Vitest + RTL
- Playwright smoke test

## Scripts
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm e2e`
- `pnpm discover:apps`

## Run Locally
1. `cd portfolio/showcase-hub`
2. `pnpm install`
3. `pnpm dev`
4. Open `http://localhost:3000`

## Data Model
Primary data file:
- `src/data/projects.ts`

Each project includes:
- `id`, `slug`, `name`, `oneLiner`
- `tags`
- `liveUrl`
- `repoPath`
- `repoUrl`

## How To Add Projects
1. Add a new entry to `src/data/projects.ts`.
2. Set `repoPath` to the workspace location (for example `apps/new-app`).
3. Set `liveUrl` when deployed (otherwise the card shows `No Demo`).
4. Optional: run `pnpm discover:apps` to generate `src/data/discovered-projects.json` from `/apps/*`.

## Live Demo + Repo Path
- `liveUrl`: used by the `Live Demo` button.
- If `liveUrl` is empty, the card still remains usable via `Open Repo`.
- `repoPath`: used by the `Repo Path` button (copies path to clipboard).
- `repoUrl`: used by `Open Repo` and should be a full URL.

By default, `src/data/projects.ts` builds `repoUrl` automatically from:
- `https://github.com/dallensmith93/pythonaiprojects/tree/main/<repoPath>`

## UI Preferences Persistence
Saved in `localStorage`:
- `search query`
- `selected tag`
- `sort mode`

## Netlify Deploy Notes
- Build command: `pnpm build`
- Publish directory: `.next`
- Set project root to `portfolio/showcase-hub`
- Ensure Node version is modern (18+)
- If using Netlify Next runtime, enable standard Next.js support in site settings.
