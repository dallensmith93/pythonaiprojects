import type { DayPlan } from './constraints'

export interface DayMacroSummary {
  day: string
  calories: number
  carbs: number
  status: 'ok' | 'high-carb' | 'low-calorie' | 'high-calorie'
}

export function summarizeMacros(days: DayPlan[], minCalories: number, maxCalories: number, maxCarbs: number): DayMacroSummary[] {
  return days.map((day) => {
    let status: DayMacroSummary['status'] = 'ok'
    if (day.carbs > maxCarbs) status = 'high-carb'
    else if (day.calories < minCalories) status = 'low-calorie'
    else if (day.calories > maxCalories) status = 'high-calorie'

    return {
      day: day.day,
      calories: day.calories,
      carbs: day.carbs,
      status
    }
  })
}
