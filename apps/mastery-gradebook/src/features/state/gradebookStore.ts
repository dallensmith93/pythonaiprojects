import { useSyncExternalStore } from 'react'

import {
  STANDARDS,
  STUDENTS,
  buildHeatmap,
  calculateStudentMasteryByStandard,
  calculateStudentProgress,
  suggestNextStandards,
  type ScoreEntry,
  type Standard,
  type Student
} from '../../domain'
import { loadGradebookData, saveGradebookData, type GradebookPersistedData } from '../persistence/storage'

export interface GradebookState {
  standards: Standard[]
  students: Student[]
  scores: ScoreEntry[]
  selectedStudentId: string
}

const defaultScores: ScoreEntry[] = [
  { studentId: 'stu-ava', standardId: 's-num-1', score: 88, assessedAtIso: '2026-01-10T09:00:00.000Z' },
  { studentId: 'stu-ava', standardId: 's-eq-1', score: 74, assessedAtIso: '2026-01-15T09:00:00.000Z' },
  { studentId: 'stu-noah', standardId: 's-num-1', score: 60, assessedAtIso: '2026-01-10T09:00:00.000Z' },
  { studentId: 'stu-mia', standardId: 's-num-1', score: 92, assessedAtIso: '2026-01-10T09:00:00.000Z' },
  { studentId: 'stu-mia', standardId: 's-num-2', score: 86, assessedAtIso: '2026-01-20T09:00:00.000Z' }
]

const defaultPersisted: GradebookPersistedData = {
  students: STUDENTS,
  scores: defaultScores,
  selectedStudentId: STUDENTS[0].id
}

let state: GradebookState = {
  standards: STANDARDS,
  ...loadGradebookData(defaultPersisted)
}

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  saveGradebookData({
    students: state.students,
    scores: state.scores,
    selectedStudentId: state.selectedStudentId
  })
}

export const gradebookActions = {
  hydrate() {
    state = {
      standards: STANDARDS,
      ...loadGradebookData(defaultPersisted)
    }
    emit()
  },
  selectStudent(studentId: string) {
    state = { ...state, selectedStudentId: studentId }
    persist()
    emit()
  },
  recordScore(studentId: string, standardId: string, score: number) {
    const clamped = Math.max(0, Math.min(100, score))
    const entry: ScoreEntry = {
      studentId,
      standardId,
      score: clamped,
      assessedAtIso: new Date().toISOString()
    }

    state = { ...state, scores: [...state.scores, entry] }
    persist()
    emit()
  },
  resetScores() {
    state = { ...state, scores: defaultScores }
    persist()
    emit()
  }
}

let hydrated = false

export function useGradebookStore<T>(selector: (state: GradebookState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      if (!hydrated && typeof window !== 'undefined') {
        hydrated = true
        gradebookActions.hydrate()
      }
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}

export function selectDerivedView(current: GradebookState) {
  const selectedStudent = current.students.find((student) => student.id === current.selectedStudentId) ?? current.students[0]
  const mastery = calculateStudentMasteryByStandard(selectedStudent, current.standards, current.scores)
  const progress = calculateStudentProgress(selectedStudent, current.standards, current.scores)
  const unlockable = suggestNextStandards(selectedStudent, current.standards, current.scores)
  const heatmap = buildHeatmap(current.students, current.standards, current.scores)

  return {
    selectedStudent,
    mastery,
    progress,
    unlockable,
    heatmap
  }
}
