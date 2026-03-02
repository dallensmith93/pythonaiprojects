import type { SimulationState } from './sim_engine'
import type { TimelineEntry } from './timeline'

export interface RunSummary {
  finalState: SimulationState
  timeline: TimelineEntry[]
  actions: SimulationState['actionsTaken']
}

export interface SimulationScore {
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  timeliness: number
  decisionQuality: number
  stability: number
  recommendations: string[]
}

const CRITICAL_ACTIONS = ['acknowledge-alerts', 'isolate-host', 'block-indicators', 'rotate-keys', 'restore-service']

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function scoreRun(summary: RunSummary): SimulationScore {
  const acceptedActions = summary.actions.filter((action) => action.accepted)
  const firstAcceptedTick = acceptedActions.length > 0 ? acceptedActions[0].tick : 10

  const criticalCoverage = CRITICAL_ACTIONS.filter((criticalAction) =>
    acceptedActions.some((action) => action.actionId === criticalAction)
  ).length / CRITICAL_ACTIONS.length

  const acceptedRatio = summary.actions.length > 0 ? acceptedActions.length / summary.actions.length : 0

  const timeliness = clamp(100 - firstAcceptedTick * 12 - summary.finalState.tick * 2, 0, 100)
  const decisionQuality = clamp(Math.round(criticalCoverage * 60 + acceptedRatio * 40), 0, 100)
  const stability = clamp(
    Math.round(100 - summary.finalState.customerImpact * 0.7 - (summary.finalState.severity - 1) * 12),
    0,
    100
  )

  const statusAdjustment = summary.finalState.status === 'resolved' ? 10 : -25
  const total = clamp(
    Math.round(decisionQuality * 0.4 + timeliness * 0.3 + stability * 0.3 + statusAdjustment),
    0,
    100
  )

  const grade: SimulationScore['grade'] =
    total >= 90 ? 'A' :
    total >= 80 ? 'B' :
    total >= 70 ? 'C' :
    total >= 60 ? 'D' :
    'F'

  const recommendations: string[] = []
  if (timeliness < 70) recommendations.push('Acknowledge and execute first containment action earlier.')
  if (decisionQuality < 70) recommendations.push('Use more core mitigation steps in the expected phase order.')
  if (stability < 70) recommendations.push('Reduce customer impact faster before shifting to recovery.')
  if (recommendations.length === 0) recommendations.push('Strong run. Add comms actions earlier for even better resilience.')

  return {
    total,
    grade,
    timeliness,
    decisionQuality,
    stability,
    recommendations
  }
}
