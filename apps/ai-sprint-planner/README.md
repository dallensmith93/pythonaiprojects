# AI Sprint Planner

ID: 05
Slug: ai-sprint-planner

Turn feature ideas into dependency-safe tickets with estimates and sprint plans.

## Planning workflow
- Create or update backlog tickets with dependencies.
- Estimate each ticket from complexity and uncertainty.
- Validate graph integrity:
- missing dependency references
- cycle detection
- Generate sprint plan using capacity-constrained sequencing.

## Invalid dependency handling
- Missing dependency links and cycles are surfaced in the UI.
- When invalid dependencies exist, sprint plan generation is blocked.
- Dependency panel shows upstream and downstream edges for selected ticket.

## Kanban usage
- Move tickets across `Backlog`, `In Sprint`, and `Done`.
- Ticket cards show estimate and dependency badges.
- Topological order and per-sprint grouping are displayed for planning confidence.

## Commands
- `pnpm --filter @apps/ai-sprint-planner dev`
- `pnpm --filter @apps/ai-sprint-planner build`
- `pnpm --filter @apps/ai-sprint-planner lint`
- `pnpm --filter @apps/ai-sprint-planner typecheck`
- `pnpm --filter @apps/ai-sprint-planner test`
- `pnpm --filter @apps/ai-sprint-planner test:coverage`
- `pnpm --filter @apps/ai-sprint-planner e2e`
