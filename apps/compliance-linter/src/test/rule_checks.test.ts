import { describe, expect, it } from 'vitest'

import { buildRewriteSuggestions } from '../domain/rewrite_suggestions'
import { lintDraft, type LintRules } from '../domain/rules_engine'
import { scoreViolations } from '../domain/scoring'

const RULES: LintRules = {
  maxWords: 20,
  bannedPhrases: ['ASAP'],
  requiredPhrases: ['next steps'],
  tone: 'formal'
}

describe('rule checks', () => {
  it('finds banned phrase and missing required phrase', () => {
    const violations = lintDraft('Please send this ASAP today.', RULES)
    expect(violations.some((v) => v.type === 'banned_phrase')).toBe(true)
    expect(violations.some((v) => v.type === 'missing_phrase')).toBe(true)
  })

  it('scores lower when violations increase', () => {
    const low = scoreViolations(lintDraft('ASAP gonna send it now', RULES)).score
    const high = scoreViolations(lintDraft('We will share next steps in a formal update.', RULES)).score
    expect(high).toBeGreaterThan(low)
  })

  it('produces meaningful suggestions per violation', () => {
    const violations = lintDraft('ASAP and gonna do this now', RULES)
    const suggestions = buildRewriteSuggestions(violations)
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.some((s) => /Replace|Add|Use neutral|Shorten/i.test(s.suggestion))).toBe(true)
  })
})
