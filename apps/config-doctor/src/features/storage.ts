import type { EnvSnapshot } from '../domain'

const KEY = 'config-doctor.snapshots.v1'

export function loadSnapshots(): EnvSnapshot[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as EnvSnapshot[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSnapshots(snapshots: EnvSnapshot[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(snapshots))
}
