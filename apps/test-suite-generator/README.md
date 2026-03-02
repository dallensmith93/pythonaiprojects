# Test Suite Generator + Flake Detector

ID: 08
Slug: test-suite-generator

Generate tests from recorded flows, store run history, and score test flakiness.

## Setup workflow
- Seed flows define user/system steps and expected outcomes.
- Test generator turns each flow into test skeleton text.
- Runner UI records pass/fail/retry outcomes over time.

## Flake detection logic
- Score combines:
- failure rate
- intermittency (pass/fail flips between consecutive runs)
- retry burden
- Levels:
- `stable` (<30)
- `warning` (30-59)
- `flaky` (>=60)
- Flaky tests are recommended for quarantine.

## Commands
- `pnpm --filter @apps/test-suite-generator dev`
- `pnpm --filter @apps/test-suite-generator build`
- `pnpm --filter @apps/test-suite-generator lint`
- `pnpm --filter @apps/test-suite-generator typecheck`
- `pnpm --filter @apps/test-suite-generator test`
- `pnpm --filter @apps/test-suite-generator test:coverage`
- `pnpm --filter @apps/test-suite-generator e2e`
