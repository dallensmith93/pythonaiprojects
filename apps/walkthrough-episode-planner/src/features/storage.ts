import type { EpisodePlan } from '../domain'

const KEY = 'walkthrough-episode-planner.state.v1'

export interface PlannerState {
  checklistText: string
  targetMinutes: number
  completedItemIds: string[]
  episodes: EpisodePlan[]
}

export function loadPlannerState(): PlannerState {
  if (typeof window === 'undefined') {
    return { checklistText: '', targetMinutes: 35, completedItemIds: [], episodes: [] }
  }

  const raw = window.localStorage.getItem(KEY)
  if (!raw) return { checklistText: '', targetMinutes: 35, completedItemIds: [], episodes: [] }

  try {
    const parsed = JSON.parse(raw) as PlannerState
    return {
      checklistText: typeof parsed.checklistText === 'string' ? parsed.checklistText : '',
      targetMinutes: typeof parsed.targetMinutes === 'number' ? parsed.targetMinutes : 35,
      completedItemIds: Array.isArray(parsed.completedItemIds) ? parsed.completedItemIds : [],
      episodes: Array.isArray(parsed.episodes) ? parsed.episodes : []
    }
  } catch {
    return { checklistText: '', targetMinutes: 35, completedItemIds: [], episodes: [] }
  }
}

export function savePlannerState(state: PlannerState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(state))
}
