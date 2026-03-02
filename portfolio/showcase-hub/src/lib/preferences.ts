import type { ProjectTag } from '../data/projects'
import type { SortMode } from './filterSort'

const PREF_KEY = 'showcase-hub.preferences.v1'

export interface Preferences {
  query: string
  tag: ProjectTag | 'all'
  sort: SortMode
}

export const DEFAULT_PREFERENCES: Preferences = {
  query: '',
  tag: 'all',
  sort: 'id-asc'
}

export function loadPreferences(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  const raw = window.localStorage.getItem(PREF_KEY)
  if (!raw) return DEFAULT_PREFERENCES

  try {
    const parsed = JSON.parse(raw) as Preferences
    return {
      query: typeof parsed.query === 'string' ? parsed.query : '',
      tag: parsed.tag ?? 'all',
      sort: parsed.sort ?? 'id-asc'
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(preferences: Preferences): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PREF_KEY, JSON.stringify(preferences))
}
