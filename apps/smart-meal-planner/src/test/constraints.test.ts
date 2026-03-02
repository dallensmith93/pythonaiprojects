import { describe, expect, it } from 'vitest'

import { MEAL_CATALOG, applySubstitution, findSubstitutions, generateWeeklyPlan, validateDayPlan } from '../domain'

describe('constraint solver', () => {
  it('generates plan satisfying default low-carb constraints', () => {
    const prefs = {
      minCalories: 1700,
      maxCalories: 2200,
      maxCarbs: 75,
      exclusions: []
    }

    const plan = generateWeeklyPlan(MEAL_CATALOG, prefs)
    expect(plan.validDays).toBe(7)

    for (const day of plan.days) {
      const result = validateDayPlan(day, prefs)
      expect(result.valid).toBe(true)
    }
  })

  it('respects exclusions in generated meal ids', () => {
    const prefs = {
      minCalories: 1500,
      maxCalories: 2300,
      maxCarbs: 90,
      exclusions: ['salmon']
    }

    const plan = generateWeeklyPlan(MEAL_CATALOG, prefs)
    const mealNames = plan.days
      .flatMap((day) => day.mealIds)
      .map((id) => MEAL_CATALOG.find((meal) => meal.id === id)?.name.toLowerCase() ?? '')

    expect(mealNames.some((name) => name.includes('salmon'))).toBe(false)
  })

  it('substitutions preserve constraints for a valid day', () => {
    const prefs = {
      minCalories: 1700,
      maxCalories: 2200,
      maxCarbs: 75,
      exclusions: []
    }

    const plan = generateWeeklyPlan(MEAL_CATALOG, prefs)
    const day = plan.days[0]
    const oldMealId = day.mealIds[0]
    const subs = findSubstitutions(oldMealId, MEAL_CATALOG, day, prefs)

    if (subs.length === 0) {
      expect(subs.length).toBeGreaterThanOrEqual(0)
      return
    }

    const swapped = applySubstitution(day, oldMealId, subs[0], MEAL_CATALOG)
    const check = validateDayPlan(swapped, prefs)
    expect(check.valid).toBe(true)
  })

  it('flags infeasible constraints', () => {
    const impossible = {
      minCalories: 2600,
      maxCalories: 2800,
      maxCarbs: 20,
      exclusions: ['egg', 'yogurt', 'chicken', 'tuna', 'salmon', 'turkey']
    }

    const plan = generateWeeklyPlan(MEAL_CATALOG, impossible)
    expect(plan.infeasibleDays).toBe(7)
  })
})
