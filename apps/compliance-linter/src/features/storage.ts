import type { LintRules } from '../domain'

const KEY = 'compliance-linter.rules.v1'

export function loadRules(defaultRules: LintRules): LintRules {
  if (typeof window === 'undefined') return defaultRules
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return defaultRules
  try {
    const parsed = JSON.parse(raw) as LintRules
    return {
      maxWords: typeof parsed.maxWords === 'number' ? parsed.maxWords : defaultRules.maxWords,
      bannedPhrases: Array.isArray(parsed.bannedPhrases) ? parsed.bannedPhrases : defaultRules.bannedPhrases,
      requiredPhrases: Array.isArray(parsed.requiredPhrases) ? parsed.requiredPhrases : defaultRules.requiredPhrases,
      tone: parsed.tone === 'formal' ? 'formal' : 'neutral'
    }
  } catch {
    return defaultRules
  }
}

export function saveRules(rules: LintRules): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(rules))
}
