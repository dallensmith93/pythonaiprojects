# Personal CRM + Follow-ups

Track contacts, pipeline stages, follow-up reminders, and quick outreach drafts.

## Workflow
1. Add/manage contacts.
2. Move contacts across pipeline stages.
3. Monitor upcoming and overdue reminders.
4. Mark contacts as reached today.
5. Generate follow-up draft text with topic context.

## Logic
- `contacts`: contact model and stage updates.
- `pipeline`: stage distribution summary.
- `reminders`: due and overdue follow-up calculations.
- `drafts`: lightweight follow-up draft rendering.
- `templates`: reusable message scaffolds.

## Storage
Contacts and stage/last-contact updates are saved in browser `localStorage`.

## Scripts
- `pnpm --filter @apps/personal-crm-followups dev`
- `pnpm --filter @apps/personal-crm-followups build`
- `pnpm --filter @apps/personal-crm-followups lint`
- `pnpm --filter @apps/personal-crm-followups typecheck`
- `pnpm --filter @apps/personal-crm-followups test`
- `pnpm --filter @apps/personal-crm-followups test:coverage`
- `pnpm --filter @apps/personal-crm-followups e2e`
