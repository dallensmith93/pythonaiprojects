export type RuleSeverity = 'high' | 'medium' | 'low'

export interface LintRules {
  maxWords: number
  bannedPhrases: string[]
  requiredPhrases: string[]
  tone: 'neutral' | 'formal'
}

export interface LintViolation {
  id: string
  severity: RuleSeverity
  type: 'length' | 'banned_phrase' | 'missing_phrase' | 'tone'
  message: string
  start?: number
  end?: number
  phrase?: string
}

export const DEFAULT_RULES: LintRules = {
  maxWords: 120,
  bannedPhrases: ['ASAP', 'obviously'],
  requiredPhrases: ['next steps'],
  tone: 'neutral'
}

function findAllRanges(text: string, needle: string): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = []
  if (!needle) return ranges

  const lowerText = text.toLowerCase()
  const lowerNeedle = needle.toLowerCase()

  let idx = lowerText.indexOf(lowerNeedle)
  while (idx >= 0) {
    ranges.push({ start: idx, end: idx + lowerNeedle.length })
    idx = lowerText.indexOf(lowerNeedle, idx + lowerNeedle.length)
  }

  return ranges
}

export function lintDraft(text: string, rules: LintRules): LintViolation[] {
  const violations: LintViolation[] = []
  const words = text.trim().split(/\s+/).filter(Boolean)

  if (words.length > rules.maxWords) {
    violations.push({
      id: 'length',
      severity: 'high',
      type: 'length',
      message: `Draft has ${words.length} words; max allowed is ${rules.maxWords}.`
    })
  }

  for (const phrase of rules.bannedPhrases.filter(Boolean)) {
    const ranges = findAllRanges(text, phrase)
    for (const [i, range] of ranges.entries()) {
      violations.push({
        id: `ban-${phrase}-${i}`,
        severity: 'medium',
        type: 'banned_phrase',
        message: `Avoid banned phrase: "${phrase}".`,
        start: range.start,
        end: range.end,
        phrase
      })
    }
  }

  for (const phrase of rules.requiredPhrases.filter(Boolean)) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      violations.push({
        id: `required-${phrase}`,
        severity: 'medium',
        type: 'missing_phrase',
        message: `Missing required phrase: "${phrase}".`,
        phrase
      })
    }
  }

  if (rules.tone === 'formal') {
    const slang = ['gonna', 'kinda', 'super', 'cool']
    for (const token of slang) {
      const ranges = findAllRanges(text, token)
      for (const [i, range] of ranges.entries()) {
        violations.push({
          id: `tone-${token}-${i}`,
          severity: 'low',
          type: 'tone',
          message: `Informal tone token found: "${token}".`,
          start: range.start,
          end: range.end,
          phrase: token
        })
      }
    }
  }

  return violations
}
