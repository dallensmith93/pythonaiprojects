import type { ScoreEntry, Student } from '../../domain'

export interface GradebookPersistedData {
  students: Student[]
  scores: ScoreEntry[]
  selectedStudentId: string
}

const STORAGE_KEY = 'mastery-gradebook/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadGradebookData(defaultData: GradebookPersistedData): GradebookPersistedData {
  if (!hasWindow()) return defaultData

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as GradebookPersistedData
    return {
      students: Array.isArray(parsed.students) ? parsed.students : defaultData.students,
      scores: Array.isArray(parsed.scores) ? parsed.scores : defaultData.scores,
      selectedStudentId: parsed.selectedStudentId ?? defaultData.selectedStudentId
    }
  } catch {
    return defaultData
  }
}

export function saveGradebookData(data: GradebookPersistedData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
