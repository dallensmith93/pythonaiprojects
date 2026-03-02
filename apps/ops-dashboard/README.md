# Personal Ops Dashboard

ID: 09
Slug: ops-dashboard

Monitor service health, ingest logs, group incidents, and generate actionable alerts with noise controls.

## How it works
- Health checks simulate latency/error/uptime snapshots for each service.
- Log ingestion appends recent service events.
- Incident grouping merges repeated non-info log fingerprints into incidents.
- Alert generation combines health and incident signals with dedupe suppression.

## Noise control strategy
- Info logs are excluded from incident groups.
- Single warning events are suppressed until repeated.
- Alert dedupe prevents repeated same-source/same-level spam per service.

## Usage
- Run health checks to refresh service status.
- Ingest logs to update incident groups.
- Review status summary, active alerts, incidents, and recent logs.

## Commands
- `pnpm --filter @apps/ops-dashboard dev`
- `pnpm --filter @apps/ops-dashboard build`
- `pnpm --filter @apps/ops-dashboard lint`
- `pnpm --filter @apps/ops-dashboard typecheck`
- `pnpm --filter @apps/ops-dashboard test`
- `pnpm --filter @apps/ops-dashboard test:coverage`
- `pnpm --filter @apps/ops-dashboard e2e`
