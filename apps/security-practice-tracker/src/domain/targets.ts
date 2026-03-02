export interface PracticeTarget {
  id: string
  name: string
  category: 'web' | 'crypto' | 'forensics' | 'network' | 'general'
  authorized: boolean
}

export const DEFAULT_TARGETS: PracticeTarget[] = [
  { id: 't1', name: 'Local CTF Web Lab', category: 'web', authorized: true },
  { id: 't2', name: 'Packet Analysis Drill', category: 'network', authorized: true },
  { id: 't3', name: 'Intro Reverse Puzzle', category: 'forensics', authorized: true }
]

export function authorizedTargetsOnly(targets: PracticeTarget[]): PracticeTarget[] {
  return targets.filter((target) => target.authorized)
}
