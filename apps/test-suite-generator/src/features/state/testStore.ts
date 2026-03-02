import { useSyncExternalStore } from 'react'

import {
  SAMPLE_FLOWS,
  appendRun,
  generateTests,
  scoreAllTests,
  suggestQuarantine,
  type GeneratedTestCase,
  type RecordedFlow,
  type TestRunResult
} from '../../domain'
import { loadTestData, saveTestData } from '../persistence/storage'

export interface TestGeneratorState {
  flows: RecordedFlow[]
  tests: GeneratedTestCase[]
  history: TestRunResult[]
}

const seedTests = generateTests(SAMPLE_FLOWS)

let state: TestGeneratorState = loadTestData({
  flows: SAMPLE_FLOWS,
  tests: seedTests,
  history: []
})

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  saveTestData(state)
}

export const testActions = {
  regenerateTests() {
    state = { ...state, tests: generateTests(state.flows) }
    persist()
    emit()
  },
  appendRun(testId: string, passed: boolean, retries: number) {
    const run: TestRunResult = {
      testId,
      passed,
      durationMs: 100 + Math.round(Math.random() * 200),
      retries,
      runAtIso: new Date().toISOString()
    }

    state = { ...state, history: appendRun(state.history, run) }
    persist()
    emit()
  },
  reset() {
    state = { flows: SAMPLE_FLOWS, tests: seedTests, history: [] }
    persist()
    emit()
  }
}

export function selectDerived(current: TestGeneratorState) {
  const flakeScores = scoreAllTests(current.history)
  const quarantine = suggestQuarantine(flakeScores)

  return {
    flakeScores,
    quarantine,
    historyByTest: Object.fromEntries(
      current.tests.map((test) => [test.id, current.history.filter((run) => run.testId === test.id)])
    )
  }
}

export function useTestStore<T>(selector: (state: TestGeneratorState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}
