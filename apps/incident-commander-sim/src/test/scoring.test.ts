import { describe, expect, it } from 'vitest'

import {
  applyMitigationAction,
  createInitialSimulationState,
  getScenarioById,
  scoreRun,
  type SimulationState,
  type UserAction
} from '../domain'

function buildSummary(finalState: SimulationState, actions: UserAction[]) {
  return {
    finalState,
    timeline: [],
    actions
  }
}

describe('scoreRun', () => {
  it('scores strong response high', () => {
    let state = createInitialSimulationState(getScenarioById('ransomware-east'))
    state = applyMitigationAction(state, 'acknowledge-alerts').state
    state = applyMitigationAction(state, 'isolate-host').state
    state = applyMitigationAction(state, 'block-indicators').state
    state = applyMitigationAction(state, 'rotate-keys').state
    state = applyMitigationAction(state, 'restore-service').state
    state = { ...state, status: 'resolved', phase: 'resolved', recovery: 90, customerImpact: 20, severity: 2 }

    const score = scoreRun(buildSummary(state, state.actionsTaken))

    expect(score.total).toBeGreaterThanOrEqual(75)
    expect(score.grade === 'A' || score.grade === 'B' || score.grade === 'C').toBe(true)
  })

  it('scores weak response low', () => {
    const state: SimulationState = {
      ...createInitialSimulationState(getScenarioById('api-key-leak')),
      tick: 18,
      severity: 5,
      containment: 10,
      recovery: 8,
      customerImpact: 95,
      status: 'failed'
    }

    const score = scoreRun(buildSummary(state, []))

    expect(score.total).toBeLessThan(55)
    expect(score.grade).toBe('F')
  })

  it('scores mixed response in middle band', () => {
    const base = createInitialSimulationState(getScenarioById('db-latency-outage'))
    const actions: UserAction[] = [
      { actionId: 'acknowledge-alerts', tick: 2, accepted: true, reason: 'accepted' },
      { actionId: 'publish-comms', tick: 3, accepted: true, reason: 'accepted' },
      { actionId: 'restore-service', tick: 3, accepted: false, reason: 'invalid-phase' }
    ]

    const state: SimulationState = {
      ...base,
      tick: 8,
      phase: 'resolved',
      severity: 2,
      containment: 62,
      recovery: 65,
      customerImpact: 38,
      status: 'resolved',
      actionsTaken: actions
    }

    const score = scoreRun(buildSummary(state, actions))

    expect(score.total).toBeGreaterThanOrEqual(40)
    expect(score.total).toBeLessThanOrEqual(80)
  })
})
