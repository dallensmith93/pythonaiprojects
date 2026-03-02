import { describe, expect, it } from 'vitest'

import {
  STANDARDS,
  buildPrerequisiteGraph,
  detectPrerequisiteCycle,
  getUnlockableStandards
} from '../domain'

describe('prerequisite graph', () => {
  it('builds graph and detects no cycle for seed standards', () => {
    const graph = buildPrerequisiteGraph(STANDARDS)
    expect(detectPrerequisiteCycle(graph)).toBe(false)
  })

  it('returns unlockable standards when prerequisites are mastered', () => {
    const statusMap: Record<string, 'not_started' | 'developing' | 'mastered'> = {
      's-num-1': 'mastered',
      's-num-2': 'developing',
      's-eq-1': 'not_started',
      's-eq-2': 'not_started',
      's-fn-1': 'not_started'
    }

    const unlockable = getUnlockableStandards(STANDARDS, statusMap)
    const codes = unlockable.map((standard) => standard.code)

    expect(codes).toContain('E.1')
    expect(codes).toContain('N.2')
    expect(codes).not.toContain('F.1')
  })
})
