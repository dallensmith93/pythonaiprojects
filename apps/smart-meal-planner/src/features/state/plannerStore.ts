import { useSyncExternalStore } from 'react'

import {
  MEAL_CATALOG,
  applySubstitution,
  buildShoppingList,
  findSubstitutions,
  generateWeeklyPlan,
  summarizeMacros,
  type DayPlan,
  type Meal,
  type PlannerPreferences,
  type WeeklyPlan
} from '../../domain'
import { loadPlannerData, savePlannerData } from '../persistence/storage'

export interface PlannerState {
  preferences: PlannerPreferences
  mealCatalog: Meal[]
  weeklyPlan: WeeklyPlan
}

const defaultPreferences: PlannerPreferences = {
  minCalories: 1700,
  maxCalories: 2200,
  maxCarbs: 75,
  exclusions: []
}

const defaultPlan = generateWeeklyPlan(MEAL_CATALOG, defaultPreferences)

let state: PlannerState = (() => {
  const persisted = loadPlannerData({
    preferences: defaultPreferences,
    mealCatalog: MEAL_CATALOG,
    weeklyDays: defaultPlan.days
  })

  return {
    preferences: persisted.preferences,
    mealCatalog: persisted.mealCatalog,
    weeklyPlan: {
      days: persisted.weeklyDays,
      validDays: persisted.weeklyDays.filter((day) => day.valid).length,
      infeasibleDays: persisted.weeklyDays.filter((day) => !day.valid).length
    }
  }
})()

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  savePlannerData({
    preferences: state.preferences,
    mealCatalog: state.mealCatalog,
    weeklyDays: state.weeklyPlan.days
  })
}

function recalcWeekly(days: DayPlan[]): WeeklyPlan {
  return {
    days,
    validDays: days.filter((day) => day.valid).length,
    infeasibleDays: days.filter((day) => !day.valid).length
  }
}

export const plannerActions = {
  regenerate() {
    state = {
      ...state,
      weeklyPlan: generateWeeklyPlan(state.mealCatalog, state.preferences)
    }
    persist()
    emit()
  },
  updatePreferences(patch: Partial<PlannerPreferences>) {
    state = {
      ...state,
      preferences: { ...state.preferences, ...patch }
    }
    state = {
      ...state,
      weeklyPlan: generateWeeklyPlan(state.mealCatalog, state.preferences)
    }
    persist()
    emit()
  },
  moveMeal(dayIndex: number, fromSlot: number, toSlot: number) {
    const day = state.weeklyPlan.days[dayIndex]
    if (!day) return
    const ids = [...day.mealIds]
    const [picked] = ids.splice(fromSlot, 1)
    ids.splice(toSlot, 0, picked)
    const nextDay = { ...day, mealIds: ids, reason: 'Meal order updated.' }
    const nextDays = state.weeklyPlan.days.map((item, idx) => (idx === dayIndex ? nextDay : item))
    state = { ...state, weeklyPlan: recalcWeekly(nextDays) }
    persist()
    emit()
  },
  substituteMeal(dayIndex: number, mealId: string, substituteId: string) {
    const day = state.weeklyPlan.days[dayIndex]
    if (!day) return
    const substitute = state.mealCatalog.find((meal) => meal.id === substituteId)
    if (!substitute) return

    const nextDay = applySubstitution(day, mealId, substitute, state.mealCatalog)
    const nextDays = state.weeklyPlan.days.map((item, idx) => (idx === dayIndex ? nextDay : item))
    state = { ...state, weeklyPlan: recalcWeekly(nextDays) }
    persist()
    emit()
  },
  resetDefaults() {
    state = {
      preferences: defaultPreferences,
      mealCatalog: MEAL_CATALOG,
      weeklyPlan: generateWeeklyPlan(MEAL_CATALOG, defaultPreferences)
    }
    persist()
    emit()
  }
}

export function getSubstitutions(day: DayPlan, mealId: string, prefs: PlannerPreferences, mealCatalog: Meal[]): Meal[] {
  return findSubstitutions(mealId, mealCatalog, day, prefs)
}

export function selectPlannerDerived(current: PlannerState) {
  return {
    macroSummaries: summarizeMacros(
      current.weeklyPlan.days,
      current.preferences.minCalories,
      current.preferences.maxCalories,
      current.preferences.maxCarbs
    ),
    shoppingList: buildShoppingList(current.weeklyPlan.days, current.mealCatalog)
  }
}

export function usePlannerStore<T>(selector: (state: PlannerState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}
