import type { ResumeBullet } from './parse_resume'

const UNSUPPORTED_TERMS = ['led', 'owned', 'architected', 'mentored', 'managed', 'reduced', 'increased', 'delivered']

export interface RewriteSuggestion {
  bulletId: string
  original: string
  rewritten: string
  addedKeywords: string[]
  blocked: boolean
  blockReason?: string
}

function containsUnsupportedClaim(original: string, rewritten: string): boolean {
  const originalLower = original.toLowerCase()
  const rewrittenLower = rewritten.toLowerCase()

  return UNSUPPORTED_TERMS.some((term) => rewrittenLower.includes(term) && !originalLower.includes(term))
}

export function rewriteBulletSafe(bullet: ResumeBullet, jdKeywords: string[]): RewriteSuggestion {
  const originalLower = bullet.text.toLowerCase()
  const missing = jdKeywords.filter((keyword) => !originalLower.includes(keyword)).slice(0, 2)

  if (missing.length === 0) {
    return {
      bulletId: bullet.id,
      original: bullet.text,
      rewritten: bullet.text,
      addedKeywords: [],
      blocked: false
    }
  }

  const rewritten = `${bullet.text} | Relevant skills: ${missing.join(', ')}`

  if (containsUnsupportedClaim(bullet.text, rewritten)) {
    return {
      bulletId: bullet.id,
      original: bullet.text,
      rewritten: bullet.text,
      addedKeywords: [],
      blocked: true,
      blockReason: 'Rewrite would introduce an unsupported achievement claim.'
    }
  }

  return {
    bulletId: bullet.id,
    original: bullet.text,
    rewritten,
    addedKeywords: missing,
    blocked: false
  }
}

export function generateRewriteSuggestions(bullets: ResumeBullet[], jdKeywords: string[]): RewriteSuggestion[] {
  return bullets.map((bullet) => rewriteBulletSafe(bullet, jdKeywords))
}
