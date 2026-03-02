import { useSyncExternalStore } from 'react'

import {
  buildStatusSummary,
  generateAlerts,
  groupIncidents,
  ingestSyntheticLogs,
  runHealthChecks,
  type AlertEvent,
  type IncidentGroup,
  type LogEvent,
  type ServiceSnapshot,
  type StatusSummary
} from '../../domain'
import { loadOpsData, saveOpsData } from '../persistence/storage'

export interface OpsState {
  snapshots: ServiceSnapshot[]
  logs: LogEvent[]
  incidents: IncidentGroup[]
}

const seedTime = new Date('2026-01-01T00:00:00.000Z').toISOString()
const seedSnapshots = runHealthChecks(Date.parse(seedTime))
const seedLogs = ingestSyntheticLogs(seedTime)
const seedIncidents = groupIncidents(seedLogs)

let state: OpsState = loadOpsData({
  snapshots: seedSnapshots,
  logs: seedLogs,
  incidents: seedIncidents
})

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  saveOpsData(state)
}

export const opsActions = {
  runChecks() {
    const now = Date.now()
    const snapshots = runHealthChecks(now)
    const logs = [...state.logs, ...ingestSyntheticLogs(new Date(now).toISOString())].slice(-200)
    const incidents = groupIncidents(logs)

    state = { snapshots, logs, incidents }
    persist()
    emit()
  },
  ingestLogs() {
    const nowIso = new Date().toISOString()
    const logs = [...state.logs, ...ingestSyntheticLogs(nowIso)].slice(-200)
    const incidents = groupIncidents(logs)
    state = { ...state, logs, incidents }
    persist()
    emit()
  },
  reset() {
    state = { snapshots: seedSnapshots, logs: seedLogs, incidents: seedIncidents }
    persist()
    emit()
  }
}

export function selectDerived(current: OpsState): {
  alerts: AlertEvent[]
  status: StatusSummary
} {
  const alerts = generateAlerts(current.snapshots, current.incidents)
  const status = buildStatusSummary(current.snapshots, alerts)
  return { alerts, status }
}

export function useOpsStore<T>(selector: (state: OpsState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}
