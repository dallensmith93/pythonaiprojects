export interface SpecRecord {
  idea: string
  createdAt: number
}

const KEY = 'spec-to-prototype.records.v1'

export function loadSpecRecords(): SpecRecord[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as SpecRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSpecRecords(records: SpecRecord[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(records))
}
