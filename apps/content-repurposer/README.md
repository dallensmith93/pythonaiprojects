# Content Repurposer (Long -> Shorts)

Convert long-form content into short standalone variants with segmentation, hooks, timing estimates, and hashtags.

## Workflow
1. Paste long source content.
2. Generate variants.
3. Review platform-specific outputs (TikTok, Reels, Shorts).
4. Edit variant bodies inline.
5. Reload later with saved local state.

## Core Logic
- `segmenter`: splits long content into coherent segments with min/max word bounds.
- `hook_engine`: creates opening hooks from segment focus terms.
- `variants`: builds per-platform outputs and flags standalone quality.
- `timing`: estimates speaking duration per output.
- `hashtagging`: suggests tags from high-signal terms.

## Standalone Rule
Each generated output is evaluated with a baseline standalone check:
- avoids weak pronoun-only starts (`this`, `it`, `they`)
- includes enough context length to stand on its own

## Local Persistence
- source text and generated variants are stored in browser `localStorage`.

## Scripts
- `pnpm --filter @apps/content-repurposer dev`
- `pnpm --filter @apps/content-repurposer build`
- `pnpm --filter @apps/content-repurposer lint`
- `pnpm --filter @apps/content-repurposer typecheck`
- `pnpm --filter @apps/content-repurposer test`
- `pnpm --filter @apps/content-repurposer test:coverage`
- `pnpm --filter @apps/content-repurposer e2e`
