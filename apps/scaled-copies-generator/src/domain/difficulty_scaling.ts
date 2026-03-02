export function scaleProblemCount(baseCount: number, level: 1 | 2 | 3): number {
  if (level === 1) return Math.max(5, baseCount)
  if (level === 2) return Math.max(8, Math.round(baseCount * 1.2))
  return Math.max(10, Math.round(baseCount * 1.4))
}

export function difficultyLabel(level: 1 | 2 | 3): string {
  if (level === 1) return 'Foundational'
  if (level === 2) return 'Practice'
  return 'Challenge'
}
