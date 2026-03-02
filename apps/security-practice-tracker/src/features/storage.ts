import type { PracticeNote, TaskRecord } from '../domain'

const KEY = 'security-practice-tracker.state.v1'

export interface TrackerState {
  tasks: TaskRecord[]
  notes: PracticeNote[]
}

export function loadState(): TrackerState {
  if (typeof window === 'undefined') return { tasks: [], notes: [] }
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return { tasks: [], notes: [] }
  try {
    const parsed = JSON.parse(raw) as TrackerState
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : []
    }
  } catch {
    return { tasks: [], notes: [] }
  }
}

export function saveState(state: TrackerState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(state))
}
