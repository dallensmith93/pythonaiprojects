import type { ParsedResume } from './parse_resume'

export interface KeywordCoverage {
  matched: string[]
  missing: string[]
  scorePercent: number
}

export function extractKeywordsFromResume(parsedResume: ParsedResume): string[] {
  const tokens = new Set<string>()
  for (const bullet of parsedResume.bullets) {
    for (const token of bullet.text.toLowerCase().replace(/[^a-z0-9+.#\s]/g, ' ').split(/\s+/)) {
      if (token.length >= 3) tokens.add(token)
    }
  }
  return [...tokens]
}

export function computeKeywordCoverage(jdKeywords: string[], resumeKeywords: string[]): KeywordCoverage {
  const resumeSet = new Set(resumeKeywords)
  const matched = jdKeywords.filter((keyword) => resumeSet.has(keyword))
  const missing = jdKeywords.filter((keyword) => !resumeSet.has(keyword))
  const scorePercent = jdKeywords.length === 0 ? 0 : Math.round((matched.length / jdKeywords.length) * 100)

  return {
    matched,
    missing,
    scorePercent
  }
}
