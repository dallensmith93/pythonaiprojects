import type { LintViolation } from './rules_engine'

export interface ComplianceScore {
  score: number
  breakdown: {
    highPenalty: number
    mediumPenalty: number
    lowPenalty: number
  }
}

export function scoreViolations(violations: LintViolation[]): ComplianceScore {
  const highPenalty = violations.filter((v) => v.severity === 'high').length * 25
  const mediumPenalty = violations.filter((v) => v.severity === 'medium').length * 12
  const lowPenalty = violations.filter((v) => v.severity === 'low').length * 5

  const score = Math.max(0, 100 - highPenalty - mediumPenalty - lowPenalty)

  return {
    score,
    breakdown: { highPenalty, mediumPenalty, lowPenalty }
  }
}
