import type { LintViolation } from './rules_engine'

export interface RewriteSuggestion {
  violationId: string
  suggestion: string
}

export function buildRewriteSuggestions(violations: LintViolation[]): RewriteSuggestion[] {
  return violations.map((violation) => {
    if (violation.type === 'length') {
      return {
        violationId: violation.id,
        suggestion: 'Shorten by removing repetition and keeping one idea per sentence.'
      }
    }

    if (violation.type === 'banned_phrase') {
      return {
        violationId: violation.id,
        suggestion: `Replace "${violation.phrase}" with a specific and neutral phrase.`
      }
    }

    if (violation.type === 'missing_phrase') {
      return {
        violationId: violation.id,
        suggestion: `Add the required phrase "${violation.phrase}" in a natural sentence.`
      }
    }

    return {
      violationId: violation.id,
      suggestion: 'Use neutral, professional language to match required tone.'
    }
  })
}
