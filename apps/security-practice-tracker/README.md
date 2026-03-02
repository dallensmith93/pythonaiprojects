# Security Practice Tracker

Track authorized security practice sessions, notes, repetition cadence, and consistency score.

## Safety + Legal Guardrails
- Use only with systems/labs you own or have explicit permission to test.
- This app tracks practice workflow and study notes only.
- No exploit automation or unauthorized targeting features are included.

## Workflow
1. Review authorized targets.
2. Work through daily scheduled tasks.
3. Mark task completion.
4. Add practice notes and observations.
5. Follow due review reminders.
6. Monitor consistency and scoring trends.

## Domain Logic
- `tasks`: daily scheduling and completion updates.
- `spaced_repetition`: due review queue by difficulty and completion history.
- `scoring`: combines consistency, difficulty, and safety-documentation signals.
- `notes`: structured notes with safety acknowledgement metadata.
- `targets`: authorized-target filtering.

## Persistence
Tasks and notes are stored in browser `localStorage`.

## Scripts
- `pnpm --filter @apps/security-practice-tracker dev`
- `pnpm --filter @apps/security-practice-tracker build`
- `pnpm --filter @apps/security-practice-tracker lint`
- `pnpm --filter @apps/security-practice-tracker typecheck`
- `pnpm --filter @apps/security-practice-tracker test`
- `pnpm --filter @apps/security-practice-tracker test:coverage`
- `pnpm --filter @apps/security-practice-tracker e2e`
