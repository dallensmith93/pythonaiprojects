import { describe, expect, it } from 'vitest'

import { SEED_TICKETS, planSprints, topologicalOrder, validateDependencyGraph, type Ticket } from '../domain'

describe('dependency resolution', () => {
  it('returns valid topological order for seed tickets', () => {
    const order = topologicalOrder(SEED_TICKETS)
    expect(order.indexOf('T-101')).toBeLessThan(order.indexOf('T-102'))
    expect(order.indexOf('T-201')).toBeLessThan(order.indexOf('T-202'))
  })

  it('detects cycle', () => {
    const cyclic: Ticket[] = [
      { id: 'A', title: 'A', feature: 'F', complexity: 2, uncertainty: 1, dependencies: ['B'], status: 'backlog' },
      { id: 'B', title: 'B', feature: 'F', complexity: 2, uncertainty: 1, dependencies: ['A'], status: 'backlog' }
    ]

    const result = validateDependencyGraph(cyclic)
    expect(result.valid).toBe(false)
    expect(result.cycle).not.toBeNull()
  })

  it('detects missing dependency reference', () => {
    const invalid: Ticket[] = [
      { id: 'A', title: 'A', feature: 'F', complexity: 2, uncertainty: 1, dependencies: ['MISSING'], status: 'backlog' }
    ]

    const result = validateDependencyGraph(invalid)
    expect(result.valid).toBe(false)
    expect(result.missingDependencies[0].missingDependencyId).toBe('MISSING')
  })

  it('plans sprints in dependency-safe sequence', () => {
    const plans = planSprints(SEED_TICKETS, 8)
    const flattened = plans.flatMap((plan) => plan.ticketIds)
    expect(flattened.indexOf('T-101')).toBeLessThan(flattened.indexOf('T-102'))
    expect(flattened.indexOf('T-201')).toBeLessThan(flattened.indexOf('T-202'))
  })
})
