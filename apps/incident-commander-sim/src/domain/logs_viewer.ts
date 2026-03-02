import type { SimulationState } from './sim_engine'
import type { TimelineEntry } from './timeline'

export type LogLevel = 'info' | 'warn' | 'error'

export interface LogEntry {
  id: string
  tick: number
  level: LogLevel
  component: string
  message: string
}

function pickLevel(severity: number, kind: TimelineEntry['kind']): LogLevel {
  if (kind === 'action') {
    return 'info'
  }

  if (severity >= 5) {
    return 'error'
  }

  if (severity >= 3) {
    return 'warn'
  }

  return 'info'
}

export function buildLogStream(state: SimulationState, timeline: TimelineEntry[]): LogEntry[] {
  const timelineLogs = timeline.map((entry) => ({
    id: `log-${entry.id}`,
    tick: entry.tick,
    level: pickLevel(entry.severity, entry.kind),
    component: entry.kind === 'action' ? 'mitigation-runner' : 'sim-engine',
    message: entry.message
  }))

  const snapshotLog: LogEntry = {
    id: `snapshot-${state.tick}`,
    tick: state.tick,
    level: state.status === 'failed' ? 'error' : 'info',
    component: 'state-snapshot',
    message: `phase=${state.phase} severity=${state.severity} containment=${state.containment} recovery=${state.recovery} impact=${state.customerImpact}`
  }

  return [...timelineLogs.slice(-24), snapshotLog]
}
