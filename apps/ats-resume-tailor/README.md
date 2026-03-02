# Resume + JD Tailor (ATS + Human)

ID: 06
Slug: ats-resume-tailor

Tailor resume bullets to a specific JD with keyword coverage, diff view, editable suggestions, and version history.

## Workflow
- Paste resume bullets and target job description.
- Review keyword coverage (matched/missing terms).
- Inspect per-bullet rewrite suggestions and before/after diff.
- Edit accepted suggestions and save as a new version.

## Safety policy (no fake content)
- Rewrites are blocked when they introduce unsupported achievement verbs not present in original bullets.
- Blocked suggestions are surfaced in the UI with clear warning reason.
- Goal is wording alignment, not fabrication of responsibilities/results.

## Versioning
- Saved versions are stored locally with timestamp and tailored bullet text.
- You can reselect past versions for comparison.

## Commands
- `pnpm --filter @apps/ats-resume-tailor dev`
- `pnpm --filter @apps/ats-resume-tailor build`
- `pnpm --filter @apps/ats-resume-tailor lint`
- `pnpm --filter @apps/ats-resume-tailor typecheck`
- `pnpm --filter @apps/ats-resume-tailor test`
- `pnpm --filter @apps/ats-resume-tailor test:coverage`
- `pnpm --filter @apps/ats-resume-tailor e2e`
