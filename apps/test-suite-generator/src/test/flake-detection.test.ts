import { describe, expect, it } from 'vitest'

import { computeFlakeScore } from '../domain'

describe('flake scoring', () => {
  it('stable runs produce low flake score', () => {
    const score = computeFlakeScore('t1', [
      { testId: 't1', passed: true, durationMs: 100, retries: 0, runAtIso: '2026-01-01T00:00:00Z' },
      { testId: 't1', passed: true, durationMs: 95, retries: 0, runAtIso: '2026-01-02T00:00:00Z' },
      { testId: 't1', passed: true, durationMs: 102, retries: 0, runAtIso: '2026-01-03T00:00:00Z' }
    ])
    expect(score.score).toBeLessThan(20)
    expect(score.level).toBe('stable')
  })

  it('intermittent failures produce high flake score', () => {
    const score = computeFlakeScore('t2', [
      { testId: 't2', passed: true, durationMs: 100, retries: 0, runAtIso: '2026-01-01T00:00:00Z' },
      { testId: 't2', passed: false, durationMs: 100, retries: 0, runAtIso: '2026-01-02T00:00:00Z' },
      { testId: 't2', passed: true, durationMs: 100, retries: 1, runAtIso: '2026-01-03T00:00:00Z' },
      { testId: 't2', passed: false, durationMs: 100, retries: 0, runAtIso: '2026-01-04T00:00:00Z' }
    ])
    expect(score.score).toBeGreaterThanOrEqual(60)
    expect(score.level).toBe('flaky')
  })

  it('retry-heavy runs increase score', () => {
    const score = computeFlakeScore('t3', [
      { testId: 't3', passed: true, durationMs: 100, retries: 2, runAtIso: '2026-01-01T00:00:00Z' },
      { testId: 't3', passed: true, durationMs: 100, retries: 3, runAtIso: '2026-01-02T00:00:00Z' },
      { testId: 't3', passed: true, durationMs: 100, retries: 2, runAtIso: '2026-01-03T00:00:00Z' }
    ])
    expect(score.score).toBeGreaterThanOrEqual(20)
  })
})
