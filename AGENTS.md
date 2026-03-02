# AGENTS

## Repo Layout
- Monorepo: `apps/<app>`

## App Structure
- `src/app`
- `src/domain`
- `src/features`
- `src/test`

## Required Scripts (per app)
- `dev`
- `build`
- `lint`
- `typecheck`
- `test`
- `test:coverage`
- `e2e`

## Testing Standard
- Unit/integration: Vitest + RTL + jest-dom
- E2E: Playwright (1 smoke test per app)
- MSW: use only if needed

## Rules
- Keep business logic in `src/domain` (pure TypeScript)
- Keep UI in `src/features`
