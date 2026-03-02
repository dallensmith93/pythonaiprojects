# Mastery-Based Gradebook + Skill Graph

ID: 02
Slug: mastery-gradebook

Track standards mastery with prerequisite-aware progression and student-level insight.

## Grading and mastery logic
- Inputs are score entries per student and standard (0-100).
- Status rules:
- `mastered`: at least 2 attempts, average >= 85, and latest >= 85.
- `developing`: latest or average >= 60 when not yet mastered.
- `not_started`: no attempts or consistently below developing threshold.
- Student progress summarizes mastered/developing/not-started counts and mastery percentage.

## Prerequisite graph behavior
- Standards form a directed prerequisite graph.
- Cycle detection is available to validate rules consistency.
- A standard is unlockable when all prerequisites are `mastered` and the standard itself is not yet mastered.

## UI flow
- Students panel to select active student.
- Student detail view:
- mastery summary
- per-standard status table
- unlockable standards list
- quick score-record controls
- Heatmap view across all students and standards for at-a-glance status.

## Persistence
- Local storage persists students, score entries, and selected student.
- Mastery is recalculated from persisted scores on load.

## Commands
- `pnpm --filter @apps/mastery-gradebook dev`
- `pnpm --filter @apps/mastery-gradebook build`
- `pnpm --filter @apps/mastery-gradebook lint`
- `pnpm --filter @apps/mastery-gradebook typecheck`
- `pnpm --filter @apps/mastery-gradebook test`
- `pnpm --filter @apps/mastery-gradebook test:coverage`
- `pnpm --filter @apps/mastery-gradebook e2e`
