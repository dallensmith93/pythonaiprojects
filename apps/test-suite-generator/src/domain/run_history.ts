export interface TestRunResult {
  testId: string
  passed: boolean
  durationMs: number
  retries: number
  runAtIso: string
}

export function appendRun(history: TestRunResult[], run: TestRunResult): TestRunResult[] {
  return [...history, run].slice(-200)
}

export function historyForTest(history: TestRunResult[], testId: string): TestRunResult[] {
  return history.filter((entry) => entry.testId === testId)
}
