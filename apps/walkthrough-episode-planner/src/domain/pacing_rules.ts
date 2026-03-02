export type PacingLevel = 'light' | 'balanced' | 'heavy'

export interface PacingAssessment {
  pacing: PacingLevel
  notes: string[]
}

export function assessPacing(totalMinutes: number, targetMinutes: number): PacingAssessment {
  const notes: string[] = []
  const ratio = totalMinutes / Math.max(1, targetMinutes)

  if (ratio < 0.7) {
    notes.push('Episode may feel too short; consider adding one optional objective.')
    return { pacing: 'light', notes }
  }

  if (ratio > 1.25) {
    notes.push('Episode is overloaded; split high-effort tasks into the next episode.')
    return { pacing: 'heavy', notes }
  }

  notes.push('Pacing is realistic for a single session.')
  return { pacing: 'balanced', notes }
}
