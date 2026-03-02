import type { LintViolation } from './rules_engine'

export interface HighlightSpan {
  start: number
  end: number
  severity: 'high' | 'medium' | 'low'
}

export function buildHighlightSpans(violations: LintViolation[]): HighlightSpan[] {
  return violations
    .filter((violation) => typeof violation.start === 'number' && typeof violation.end === 'number')
    .map((violation) => ({
      start: violation.start as number,
      end: violation.end as number,
      severity: violation.severity
    }))
    .sort((a, b) => a.start - b.start)
}
