# Budget + Subscription Detective

ID: 03
Slug: budget-subscription-detective

Import transactions, auto-categorize spending, detect recurring subscriptions and anomalies, and forecast cash flow.

## Import flow
- Paste CSV rows with header: `date,description,amount,merchant`.
- Imported rows are parsed into typed transactions and merged into local state.
- Data is persisted in local storage.

## Categorization rules
- Rules are keyword-driven with priority ordering.
- Matching logic checks merchant/description text plus optional amount bounds.
- Highest-priority matching rule wins.
- Each categorized transaction includes a human-readable reason (`Matched rule: ...` or fallback).

## Subscription + anomaly detection
- Subscriptions: recurring expense transactions by merchant with stable amount and ~monthly cadence.
- Anomalies: merchant-specific outliers where amount is significantly above baseline variance.
- Both detectors provide explainable text for UI display.

## Forecasting
- Monthly income/expense history is aggregated.
- Next months are projected from historical monthly averages.
- Forecast output includes projected income, expense, and net cash flow.

## Commands
- `pnpm --filter @apps/budget-subscription-detective dev`
- `pnpm --filter @apps/budget-subscription-detective build`
- `pnpm --filter @apps/budget-subscription-detective lint`
- `pnpm --filter @apps/budget-subscription-detective typecheck`
- `pnpm --filter @apps/budget-subscription-detective test`
- `pnpm --filter @apps/budget-subscription-detective test:coverage`
- `pnpm --filter @apps/budget-subscription-detective e2e`
