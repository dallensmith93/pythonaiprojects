# Walkthrough / Achievement Episode Planner

Convert checklist objectives into realistic episode plans with pacing guidance and progress tracking.

## Workflow
1. Paste a checklist (one objective per line, optional durations like `20m`).
2. Set target minutes per episode.
3. Build plan to chunk tasks into episodes.
4. Review pacing notes (`light`, `balanced`, `heavy`).
5. Track completion with per-item checkboxes.
6. Copy markdown export for publishing or sharing.

## Domain Logic
- `checklist_import`: parses checklist text into typed items with estimated minutes + difficulty.
- `chunking`: groups checklist items into episode-sized chunks.
- `pacing_rules`: labels pacing realism against target time budgets.
- `episode_titles`: generates titles from each chunk.
- `exports`: renders markdown output for external use.

## Persistence
Planner state is saved in browser `localStorage`:
- checklist text
- target minutes
- generated episodes
- completed item ids

## Scripts
- `pnpm --filter @apps/walkthrough-episode-planner dev`
- `pnpm --filter @apps/walkthrough-episode-planner build`
- `pnpm --filter @apps/walkthrough-episode-planner lint`
- `pnpm --filter @apps/walkthrough-episode-planner typecheck`
- `pnpm --filter @apps/walkthrough-episode-planner test`
- `pnpm --filter @apps/walkthrough-episode-planner test:coverage`
- `pnpm --filter @apps/walkthrough-episode-planner e2e`
