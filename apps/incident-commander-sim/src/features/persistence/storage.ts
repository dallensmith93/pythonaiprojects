import type { SimulationState, UserAction } from '../../domain'
import type { TimelineEntry } from '../../domain'
import type { SimulationScore } from '../../domain'

export interface RunRecord {
  id: string
  scenarioId: string
  completedAtIso: string
  finalState: SimulationState
  timeline: TimelineEntry[]
  actions: UserAction[]
  score: SimulationScore
}

export interface PersistedData {
  selectedScenarioId: string
  runHistory: RunRecord[]
}

const STORAGE_KEY = 'incident-commander-sim/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadPersistedData(defaultScenarioId: string): PersistedData {
  if (!hasWindow()) {
    return { selectedScenarioId: defaultScenarioId, runHistory: [] }
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { selectedScenarioId: defaultScenarioId, runHistory: [] }
  }

  try {
    const parsed = JSON.parse(raw) as PersistedData
    return {
      selectedScenarioId: parsed.selectedScenarioId ?? defaultScenarioId,
      runHistory: Array.isArray(parsed.runHistory) ? parsed.runHistory : []
    }
  } catch {
    return { selectedScenarioId: defaultScenarioId, runHistory: [] }
  }
}

export function savePersistedData(data: PersistedData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function persistScenarioSelection(selectedScenarioId: string, runHistory: RunRecord[]): void {
  savePersistedData({ selectedScenarioId, runHistory })
}

export function persistRunRecord(selectedScenarioId: string, runHistory: RunRecord[], record: RunRecord): RunRecord[] {
  const updated = [record, ...runHistory].slice(0, 20)
  savePersistedData({ selectedScenarioId, runHistory: updated })
  return updated
}
