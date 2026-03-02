import { describe, expect, it } from 'vitest'

import {
  advanceSimulationTick,
  applyMitigationAction,
  createInitialSimulationState,
  getScenarioById
} from '../domain'

describe('simulation transitions', () => {
  it('moves from detection to triage after acknowledge action', () => {
    const initial = createInitialSimulationState(getScenarioById('ransomware-east'))
    const result = applyMitigationAction(initial, 'acknowledge-alerts')

    expect(result.state.phase).toBe('triage')
    expect(result.outcome?.accepted).toBe(true)
  })

  it('rejects invalid phase action and records it', () => {
    const initial = createInitialSimulationState(getScenarioById('api-key-leak'))
    const result = applyMitigationAction(initial, 'restore-service')

    expect(result.outcome?.accepted).toBe(false)
    expect(result.state.actionsTaken.at(-1)?.accepted).toBe(false)
  })

  it('fails run when impact reaches threshold', () => {
    let state = createInitialSimulationState(getScenarioById('db-latency-outage'))

    for (let i = 0; i < 30; i += 1) {
      state = advanceSimulationTick(state).state
      if (state.status !== 'active') break
    }

    expect(state.status).toBe('failed')
  })
})
