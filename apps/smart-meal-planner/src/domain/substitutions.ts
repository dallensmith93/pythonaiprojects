import type { DayPlan, Meal, PlannerPreferences } from './constraints'

export function findSubstitutions(
  targetMealId: string,
  meals: Meal[],
  dayPlan: DayPlan,
  prefs: PlannerPreferences
): Meal[] {
  const target = meals.find((meal) => meal.id === targetMealId)
  if (!target) return []

  const used = new Set(dayPlan.mealIds)

  return meals
    .filter((meal) => meal.type === target.type)
    .filter((meal) => meal.id !== target.id)
    .filter((meal) => !used.has(meal.id))
    .filter((meal) => dayPlan.carbs - target.carbs + meal.carbs <= prefs.maxCarbs)
    .filter((meal) => {
      const newCalories = dayPlan.calories - target.calories + meal.calories
      return newCalories >= prefs.minCalories && newCalories <= prefs.maxCalories
    })
    .sort((a, b) => a.carbs - b.carbs)
}

export function applySubstitution(dayPlan: DayPlan, oldMealId: string, newMeal: Meal, meals: Meal[]): DayPlan {
  const oldMeal = meals.find((meal) => meal.id === oldMealId)
  if (!oldMeal) return dayPlan

  const nextMealIds = dayPlan.mealIds.map((mealId) => (mealId === oldMealId ? newMeal.id : mealId))
  return {
    ...dayPlan,
    mealIds: nextMealIds,
    calories: dayPlan.calories - oldMeal.calories + newMeal.calories,
    carbs: dayPlan.carbs - oldMeal.carbs + newMeal.carbs,
    reason: `Replaced ${oldMeal.name} with ${newMeal.name}.`
  }
}
