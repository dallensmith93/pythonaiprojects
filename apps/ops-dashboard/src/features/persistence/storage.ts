import type { IncidentGroup, LogEvent, ServiceSnapshot } from '../../domain'

export interface PersistedOpsData {
  snapshots: ServiceSnapshot[]
  logs: LogEvent[]
  incidents: IncidentGroup[]
}

const STORAGE_KEY = 'ops-dashboard/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadOpsData(defaultData: PersistedOpsData): PersistedOpsData {
  if (!hasWindow()) return defaultData
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as PersistedOpsData
    return {
      snapshots: Array.isArray(parsed.snapshots) ? parsed.snapshots : defaultData.snapshots,
      logs: Array.isArray(parsed.logs) ? parsed.logs : defaultData.logs,
      incidents: Array.isArray(parsed.incidents) ? parsed.incidents : defaultData.incidents
    }
  } catch {
    return defaultData
  }
}

export function saveOpsData(data: PersistedOpsData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
