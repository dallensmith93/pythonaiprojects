import type { Ticket } from '../../domain'

export interface PersistedSprintData {
  tickets: Ticket[]
  sprintCapacityPoints: number
}

const STORAGE_KEY = 'ai-sprint-planner/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadSprintData(defaultData: PersistedSprintData): PersistedSprintData {
  if (!hasWindow()) return defaultData
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as PersistedSprintData
    return {
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : defaultData.tickets,
      sprintCapacityPoints: typeof parsed.sprintCapacityPoints === 'number' ? parsed.sprintCapacityPoints : defaultData.sprintCapacityPoints
    }
  } catch {
    return defaultData
  }
}

export function saveSprintData(data: PersistedSprintData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
