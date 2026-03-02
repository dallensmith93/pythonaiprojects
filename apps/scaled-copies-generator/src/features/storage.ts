import type { AnswerKeyItem } from '../domain'
import type { ProblemSet } from '../domain/problem_gen'

const KEY = 'scaled-copies.problem-sets.v1'

export interface StoredWorksheet {
  set: ProblemSet
  answers: AnswerKeyItem[]
}

export function loadWorksheets(): StoredWorksheet[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as StoredWorksheet[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveWorksheets(items: StoredWorksheet[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(items))
}
