import type { TestRunResult } from './run_history'

export interface FlakeScore {
  testId: string
  score: number
  level: 'stable' | 'warning' | 'flaky'
  reason: string
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function computeFlakeScore(testId: string, runs: TestRunResult[]): FlakeScore {
  if (runs.length === 0) {
    return { testId, score: 0, level: 'stable', reason: 'No run history yet.' }
  }

  const failures = runs.filter((run) => !run.passed).length
  const failureRate = failures / runs.length

  let flips = 0
  for (let i = 1; i < runs.length; i += 1) {
    if (runs[i - 1].passed !== runs[i].passed) flips += 1
  }
  const intermittency = runs.length <= 1 ? 0 : flips / (runs.length - 1)

  const retryRate = runs.reduce((sum, run) => sum + run.retries, 0) / runs.length

  const raw = failureRate * 50 + intermittency * 35 + Math.min(20, retryRate * 12)
  const score = Math.round(clamp(raw, 0, 100))

  const level: FlakeScore['level'] =
    score >= 60 ? 'flaky' :
    score >= 30 ? 'warning' :
    'stable'

  return {
    testId,
    score,
    level,
    reason: `failureRate=${failureRate.toFixed(2)}, intermittency=${intermittency.toFixed(2)}, retries=${retryRate.toFixed(2)}`
  }
}

export function scoreAllTests(history: TestRunResult[]): FlakeScore[] {
  const byTest = new Map<string, TestRunResult[]>()
  for (const run of history) {
    byTest.set(run.testId, [...(byTest.get(run.testId) ?? []), run])
  }

  return [...byTest.entries()].map(([testId, runs]) => computeFlakeScore(testId, runs))
}
