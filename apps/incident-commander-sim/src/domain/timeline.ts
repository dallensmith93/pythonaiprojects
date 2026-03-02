import type { IncidentPhase, SimulationState } from './sim_engine'

export type TimelineKind = 'system' | 'action' | 'phase'

export interface TimelineEntry {
  id: string
  tick: number
  phase: IncidentPhase
  severity: number
  kind: TimelineKind
  message: string
}

export function createTimelineEntry(
  state: SimulationState,
  kind: TimelineKind,
  message: string
): TimelineEntry {
  return {
    id: `${kind}-${state.tick}-${state.actionsTaken.length}`,
    tick: state.tick,
    phase: state.phase,
    severity: state.severity,
    kind,
    message
  }
}
