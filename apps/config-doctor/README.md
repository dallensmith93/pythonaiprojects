# Config Doctor

Diagnose local developer environment issues and produce safe fix plans.

## What It Does
- Collects a lightweight environment snapshot.
- Runs diagnostics for common setup gaps (Node, pnpm, Git, Python, PATH).
- Maps issues through a rule engine to recommended fix steps.
- Applies safety guardrails to filter destructive commands.
- Stores recent snapshots locally.

## Safety Policy
- Only safe, reviewable checklist-style fixes are generated.
- Potentially destructive commands are blocked (for example `rm -rf`, registry deletes, format operations).
- Output is guidance-focused; execution remains manual.

## Workflow
1. Select OS and environment checklist values.
2. Click `Run Diagnosis`.
3. Review generated fix plans and safety status.
4. Copy safe script/checklist snippets as needed.

## Scripts
- `pnpm --filter @apps/config-doctor dev`
- `pnpm --filter @apps/config-doctor build`
- `pnpm --filter @apps/config-doctor lint`
- `pnpm --filter @apps/config-doctor typecheck`
- `pnpm --filter @apps/config-doctor test`
- `pnpm --filter @apps/config-doctor test:coverage`
- `pnpm --filter @apps/config-doctor e2e`
