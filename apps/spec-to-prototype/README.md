# Spec Builder (Spec -> Prototype)

Generate PRD, API schema, UI skeleton notes, and starter repo scaffolding from a feature idea.

## Workflow
1. Enter a product idea.
2. Generate outputs.
3. Review each tab:
   - PRD
   - API
   - UI
   - Repo
   - Consistency
4. Save ideas to local history.

## Modules
- `prd`: PRD output from feature idea.
- `schemas`: REST-style endpoint schema generation.
- `ui_skeleton`: pages, components, and design notes.
- `starter_repo_gen`: starter file map aligned to API/UI outputs.
- `consistency`: cross-checks output alignment.

## Consistency Policy
Outputs are aligned when:
- PRD has goals and success metrics.
- API includes at least one GET endpoint.
- UI includes an overview/dashboard page.

## Storage
Recent spec ideas are stored in browser `localStorage`.

## Scripts
- `pnpm --filter @apps/spec-to-prototype dev`
- `pnpm --filter @apps/spec-to-prototype build`
- `pnpm --filter @apps/spec-to-prototype lint`
- `pnpm --filter @apps/spec-to-prototype typecheck`
- `pnpm --filter @apps/spec-to-prototype test`
- `pnpm --filter @apps/spec-to-prototype test:coverage`
- `pnpm --filter @apps/spec-to-prototype e2e`
