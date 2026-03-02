import type { ProgressRecord } from '../domain'

const PROGRESS_KEY = 'learning-path-builder.progress.v1'

export function loadProgressRecords(): ProgressRecord[] {
  if (typeof window === 'undefined') return []

  const raw = window.localStorage.getItem(PROGRESS_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as ProgressRecord[]
    return parsed.filter((record) =>
      typeof record.skillId === 'string' &&
      typeof record.mastery === 'number' &&
      typeof record.lastReviewedDay === 'number'
    )
  } catch {
    return []
  }
}

export function saveProgressRecords(records: ProgressRecord[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(records))
}
