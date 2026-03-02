import type { DayPlan, Meal, PlannerPreferences } from '../../domain'

export interface PlannerPersistedData {
  preferences: PlannerPreferences
  mealCatalog: Meal[]
  weeklyDays: DayPlan[]
}

const STORAGE_KEY = 'smart-meal-planner/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadPlannerData(defaultData: PlannerPersistedData): PlannerPersistedData {
  if (!hasWindow()) return defaultData

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as PlannerPersistedData
    return {
      preferences: parsed.preferences ?? defaultData.preferences,
      mealCatalog: Array.isArray(parsed.mealCatalog) ? parsed.mealCatalog : defaultData.mealCatalog,
      weeklyDays: Array.isArray(parsed.weeklyDays) ? parsed.weeklyDays : defaultData.weeklyDays
    }
  } catch {
    return defaultData
  }
}

export function savePlannerData(data: PlannerPersistedData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
