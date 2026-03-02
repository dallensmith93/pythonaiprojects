# Incident Commander Simulator

ID: 01
Slug: incident-commander-sim

Realistic incident response simulation with alerts, logs, timeline progression, and mitigation-driven scoring.

## How the simulation works
- Pick a scenario (ransomware, key leak, or outage) and start in the `detection` phase.
- Time advances in ticks. Each tick can worsen severity and customer impact when containment is weak.
- Mitigation actions are phase-gated. Correct ordering moves the run through:
  - detection -> triage -> containment -> eradication -> recovery -> resolved
- Runs fail when customer impact reaches 100 or runtime exceeds the cap.

## Alerts, logs, and timeline
- Alerts are generated from live state (severity, containment gap, customer impact, noise, terminal status).
- Timeline stores system ticks, mitigation actions, and phase changes.
- Log stream mirrors timeline events and includes a rolling state snapshot for debugging response flow.

## Action panel and scoring
- Action panel applies mitigation steps like isolating hosts, rotating keys, and restoring service.
- Invalid-phase actions are recorded as rejected and hurt decision quality.
- Score combines:
  - timeliness (how quickly meaningful actions start)
  - decision quality (critical action coverage + acceptance ratio)
  - stability (final severity and customer impact)
- Output includes total score, grade, and improvement recommendations.

## Persistence
- Local storage persists selected scenario and completed run history.
- Each completed run stores final state, actions, timeline, and score.

## Run commands
- `pnpm --filter @apps/incident-commander-sim dev`
- `pnpm --filter @apps/incident-commander-sim build`
- `pnpm --filter @apps/incident-commander-sim lint`
- `pnpm --filter @apps/incident-commander-sim typecheck`
- `pnpm --filter @apps/incident-commander-sim test`
- `pnpm --filter @apps/incident-commander-sim test:coverage`
- `pnpm --filter @apps/incident-commander-sim e2e`
