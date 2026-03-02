import type { CodebaseIndex, SourceDocument } from '../../domain'

export interface NavigatorPersistedData {
  docs: SourceDocument[]
  index: CodebaseIndex | null
}

const STORAGE_KEY = 'codebase-navigator/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadNavigatorData(defaultData: NavigatorPersistedData): NavigatorPersistedData {
  if (!hasWindow()) return defaultData
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as NavigatorPersistedData
    return {
      docs: Array.isArray(parsed.docs) ? parsed.docs : defaultData.docs,
      index: parsed.index ?? defaultData.index
    }
  } catch {
    return defaultData
  }
}

export function saveNavigatorData(data: NavigatorPersistedData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
