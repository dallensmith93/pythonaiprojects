# Learning Path Builder

Adaptive weekly learning plans with prerequisite-aware sequencing, spaced repetition, and local progress tracking.

## What It Does
- Parses a plain-language goal into learning constraints (`domain`, `target weeks`, `sessions/week`).
- Builds a weekly calendar of learn/review tasks.
- Prioritizes skill order by prerequisites.
- Adds due review sessions using spaced repetition intervals from mastery.
- Persists progress in browser `localStorage`.

## Planning Logic
- Skills are ordered with topological prerequisite sorting.
- Mastery thresholds:
  - `>= 85`: completed
  - `1..84`: in progress
- Review intervals:
  - `>= 90`: 7 days
  - `>= 75`: 4 days
  - `>= 60`: 2 days
  - otherwise: 1 day
- Session pacing:
  - goal parser clamps to `2..16` weeks and `3..7` sessions/week.
  - planner splits days across `Mon..Sun`.
  - when a review is due, session time is split between review and learning.

## App Structure
- `src/domain`: pure TypeScript scheduling and progression logic.
- `src/features`: React UI and local persistence helpers.
- `src/app`: Next.js route entry.
- `src/test`: unit and UI tests.

## Scripts
- `pnpm --filter @apps/learning-path-builder dev`
- `pnpm --filter @apps/learning-path-builder build`
- `pnpm --filter @apps/learning-path-builder lint`
- `pnpm --filter @apps/learning-path-builder typecheck`
- `pnpm --filter @apps/learning-path-builder test`
- `pnpm --filter @apps/learning-path-builder test:coverage`
- `pnpm --filter @apps/learning-path-builder e2e`

## How To Use
1. Start the app and enter a goal sentence (example: `Learn TypeScript in 6 weeks with 5 study sessions`).
2. Review the generated weekly calendar.
3. Click a task to open the Action Panel.
4. Mark completion to increase mastery and trigger future review scheduling.
