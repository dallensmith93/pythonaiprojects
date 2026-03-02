# Compliance Linter

Check writing against configurable rules, highlight issues, and provide rewrite guidance.

## Features
- Rule engine for max length, banned phrases, required phrases, and tone.
- Severity-based compliance scoring.
- Highlight spans for phrase-level issues in editor preview.
- Rewrite suggestions tied to each violation.
- Persisted rule settings in browser `localStorage`.

## Workflow
1. Edit draft in the editor.
2. Configure rule controls.
3. Review score, issue list, and highlighted text.
4. Apply suggested rewrites.

## Modules
- `rules_engine`: rule evaluation and violation detection.
- `scoring`: score calculation from violation severity.
- `annotations`: highlight span generation.
- `rewrite_suggestions`: actionable remediation suggestions.

## Scripts
- `pnpm --filter @apps/compliance-linter dev`
- `pnpm --filter @apps/compliance-linter build`
- `pnpm --filter @apps/compliance-linter lint`
- `pnpm --filter @apps/compliance-linter typecheck`
- `pnpm --filter @apps/compliance-linter test`
- `pnpm --filter @apps/compliance-linter test:coverage`
- `pnpm --filter @apps/compliance-linter e2e`
