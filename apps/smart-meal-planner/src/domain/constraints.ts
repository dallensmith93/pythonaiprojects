export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Meal {
  id: string
  name: string
  type: MealType
  calories: number
  carbs: number
  protein: number
  prepMinutes: number
  tags: string[]
  ingredients: string[]
  recipe: string[]
}

export interface PlannerPreferences {
  minCalories: number
  maxCalories: number
  maxCarbs: number
  exclusions: string[]
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export type DayKey = (typeof DAYS)[number]

export interface DayPlan {
  day: DayKey
  mealIds: string[]
  calories: number
  carbs: number
  valid: boolean
  reason: string
}

export interface WeeklyPlan {
  days: DayPlan[]
  validDays: number
  infeasibleDays: number
}

export interface FeasibilityResult {
  valid: boolean
  reason: string
}

function includesExclusion(meal: Meal, exclusions: string[]): boolean {
  const lower = exclusions.map((item) => item.toLowerCase())
  const text = `${meal.name} ${meal.tags.join(' ')}`.toLowerCase()
  return lower.some((exclusion) => text.includes(exclusion))
}

function scoreMeal(meal: Meal): number {
  return meal.carbs * 2 + meal.prepMinutes * 1.2 + Math.max(0, 550 - meal.calories) * 0.1
}

function chooseMealsForDay(available: Meal[], prefs: PlannerPreferences): DayPlan {
  const sorted = [...available].sort((a, b) => scoreMeal(a) - scoreMeal(b))

  let best: DayPlan = {
    day: 'Mon',
    mealIds: [],
    calories: 0,
    carbs: 0,
    valid: false,
    reason: 'No feasible combination found.'
  }

  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = 0; j < sorted.length; j += 1) {
      if (j === i) continue
      for (let k = 0; k < sorted.length; k += 1) {
        if (k === i || k === j) continue
        const a = sorted[i]
        const b = sorted[j]
        const c = sorted[k]
        const calories = a.calories + b.calories + c.calories
        const carbs = a.carbs + b.carbs + c.carbs
        const valid = calories >= prefs.minCalories && calories <= prefs.maxCalories && carbs <= prefs.maxCarbs

        const candidate: DayPlan = {
          day: 'Mon',
          mealIds: [a.id, b.id, c.id],
          calories,
          carbs,
          valid,
          reason: valid
            ? 'Constraints satisfied.'
            : `Daily totals out of bounds: calories=${calories}, carbs=${carbs}.`
        }

        if (valid) {
          return candidate
        }

        if (candidate.calories > best.calories) {
          best = candidate
        }
      }
    }
  }

  return best
}

export function generateWeeklyPlan(meals: Meal[], prefs: PlannerPreferences): WeeklyPlan {
  const filtered = meals.filter((meal) => !includesExclusion(meal, prefs.exclusions))
  const template = chooseMealsForDay(filtered, prefs)

  const days = DAYS.map((day, index) => ({
    ...template,
    day,
    mealIds: template.mealIds.length === 0 ? [] : [...template.mealIds].map((id, position) => `${id}`),
    reason: template.valid
      ? `Constraints satisfied using simple low-carb meals (day ${index + 1}).`
      : template.reason
  }))

  return {
    days,
    validDays: days.filter((day) => day.valid).length,
    infeasibleDays: days.filter((day) => !day.valid).length
  }
}

export function validateDayPlan(dayPlan: DayPlan, prefs: PlannerPreferences): FeasibilityResult {
  if (dayPlan.mealIds.length !== 3) {
    return { valid: false, reason: 'Expected 3 meals per day.' }
  }

  if (dayPlan.calories < prefs.minCalories || dayPlan.calories > prefs.maxCalories) {
    return { valid: false, reason: 'Calories out of preference range.' }
  }

  if (dayPlan.carbs > prefs.maxCarbs) {
    return { valid: false, reason: 'Carb limit exceeded.' }
  }

  return { valid: true, reason: 'Day satisfies constraints.' }
}
