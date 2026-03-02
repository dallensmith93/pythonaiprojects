import { describe, expect, it } from 'vitest'

import {
  computeKeywordCoverage,
  extractKeywordsFromJd,
  extractKeywordsFromResume,
  generateRewriteSuggestions,
  parseResume
} from '../domain'

describe('keyword extraction and matching', () => {
  it('extracts keywords from jd text', () => {
    const keywords = extractKeywordsFromJd('Need TypeScript testing APIs collaboration and observability experience')
    expect(keywords).toContain('typescript')
    expect(keywords).toContain('testing')
  })

  it('computes keyword coverage', () => {
    const resume = parseResume('- Built APIs in TypeScript\n- Improved observability')
    const coverage = computeKeywordCoverage(['typescript', 'apis', 'testing'], extractKeywordsFromResume(resume))

    expect(coverage.matched).toContain('typescript')
    expect(coverage.missing).toContain('testing')
    expect(coverage.scorePercent).toBeGreaterThan(0)
  })

  it('blocks unsupported rewrite claims', () => {
    const resume = parseResume('- Collaborated with designers to refine UI handoff')
    const suggestions = generateRewriteSuggestions(resume.bullets, ['managed', 'mentored'])

    const blocked = suggestions.find((item) => item.blocked)
    expect(blocked).toBeDefined()
  })
})
