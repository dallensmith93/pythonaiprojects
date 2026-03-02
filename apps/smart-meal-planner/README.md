# Smart Meal Planner (Low-carb, Simple)

ID: 04
Slug: smart-meal-planner

Generate practical low-carb weekly meal plans with constraints, substitutions, recipes, and shopping list output.

## Usage
- Set preferences: minimum calories, maximum calories, carb limit, and optional exclusions.
- Generate or regenerate the weekly plan.
- Review each day for calories/carbs validity and planning notes.
- Swap meals using substitution controls that keep constraints valid.

## Constraint logic
- Daily plan targets 3 meals (breakfast, lunch, dinner).
- Valid day requires:
- calories within `[minCalories, maxCalories]`
- carbs `<= maxCarbs`
- no excluded ingredients/tags
- If no feasible combination exists, the day is marked infeasible with reason.

## Customization
- Update exclusions (comma separated).
- Adjust calorie/carb goals and regenerate.
- Use swap controls to pick alternative same-type meals that preserve constraints.

## Recipe + shopping list
- Recipe panel shows selected day meal steps.
- Shopping list aggregates ingredient counts across all planned meals.

## Commands
- `pnpm --filter @apps/smart-meal-planner dev`
- `pnpm --filter @apps/smart-meal-planner build`
- `pnpm --filter @apps/smart-meal-planner lint`
- `pnpm --filter @apps/smart-meal-planner typecheck`
- `pnpm --filter @apps/smart-meal-planner test`
- `pnpm --filter @apps/smart-meal-planner test:coverage`
- `pnpm --filter @apps/smart-meal-planner e2e`
