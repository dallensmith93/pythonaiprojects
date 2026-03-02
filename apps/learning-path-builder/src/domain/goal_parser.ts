export interface ParsedGoal {
  rawGoal: string
  domain: string
  targetWeeks: number
  sessionsPerWeek: number
}

export function parseGoal(input: string): ParsedGoal {
  const lower = input.toLowerCase()
  const weekMatch = lower.match(/(\d+)\s*week/)
  const sessionMatch = lower.match(/(\d+)\s*(session|study block|study)/)

  const targetWeeks = weekMatch ? Number(weekMatch[1]) : 6
  const sessionsPerWeek = sessionMatch ? Number(sessionMatch[1]) : 5

  return {
    rawGoal: input,
    domain: lower.includes('typescript') ? 'TypeScript' : lower.includes('math') ? 'Math' : 'General',
    targetWeeks: Math.min(16, Math.max(2, targetWeeks)),
    sessionsPerWeek: Math.min(7, Math.max(3, sessionsPerWeek))
  }
}
