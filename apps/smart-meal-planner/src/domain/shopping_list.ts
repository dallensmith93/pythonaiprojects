import type { DayPlan, Meal } from './constraints'

export interface ShoppingItem {
  ingredient: string
  count: number
}

export function buildShoppingList(days: DayPlan[], meals: Meal[]): ShoppingItem[] {
  const counts = new Map<string, number>()

  for (const day of days) {
    for (const mealId of day.mealIds) {
      const meal = meals.find((item) => item.id === mealId)
      if (!meal) continue

      for (const ingredient of meal.ingredients) {
        counts.set(ingredient, (counts.get(ingredient) ?? 0) + 1)
      }
    }
  }

  return [...counts.entries()]
    .map(([ingredient, count]) => ({ ingredient, count }))
    .sort((a, b) => a.ingredient.localeCompare(b.ingredient))
}
