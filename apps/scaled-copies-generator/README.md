# Scaled Copies Worksheet Generator

Generate scalable arithmetic worksheets and matching answer keys for quick practice sets.

## Workflow
1. Enter worksheet title.
2. Choose difficulty level (1-3).
3. Set base problem count.
4. Generate worksheet.
5. Use printable worksheet + answer key exports.
6. Reopen recent saved sets from local storage.

## Math Logic
- `problem_gen`: generates arithmetic items (`+`, `-`, `x`) by level ranges.
- `difficulty_scaling`: scales problem count and exposes readable level labels.
- `answer_keys`: computes exact numeric answers per problem.
- `print_export`: renders worksheet and key as printable text.

## Accuracy Rules
- Subtraction problems are normalized to non-negative results (`a >= b`).
- Answer keys are derived directly from the operation + operands.
- Correctness tests verify arithmetic for generated sets.

## Persistence
Generated sets and answer keys are saved in browser `localStorage` (latest 10 sets).

## Scripts
- `pnpm --filter @apps/scaled-copies-generator dev`
- `pnpm --filter @apps/scaled-copies-generator build`
- `pnpm --filter @apps/scaled-copies-generator lint`
- `pnpm --filter @apps/scaled-copies-generator typecheck`
- `pnpm --filter @apps/scaled-copies-generator test`
- `pnpm --filter @apps/scaled-copies-generator test:coverage`
- `pnpm --filter @apps/scaled-copies-generator e2e`
