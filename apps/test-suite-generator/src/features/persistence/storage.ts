import type { GeneratedTestCase, RecordedFlow, TestRunResult } from '../../domain'

export interface PersistedTestData {
  flows: RecordedFlow[]
  tests: GeneratedTestCase[]
  history: TestRunResult[]
}

const STORAGE_KEY = 'test-suite-generator/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadTestData(defaultData: PersistedTestData): PersistedTestData {
  if (!hasWindow()) return defaultData
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as PersistedTestData
    return {
      flows: Array.isArray(parsed.flows) ? parsed.flows : defaultData.flows,
      tests: Array.isArray(parsed.tests) ? parsed.tests : defaultData.tests,
      history: Array.isArray(parsed.history) ? parsed.history : defaultData.history
    }
  } catch {
    return defaultData
  }
}

export function saveTestData(data: PersistedTestData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
