const STOPWORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'to', 'for', 'with', 'on', 'in', 'of', 'at', 'by', 'as', 'is', 'are', 'be', 'from'
])

export interface ParsedJd {
  text: string
  keywords: string[]
}

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)
    .filter((token) => !STOPWORDS.has(token))
}

export function extractKeywordsFromJd(jdText: string): string[] {
  const counts = new Map<string, number>()
  for (const token of tokenize(jdText)) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([token]) => token)
}

export function parseJd(jdText: string): ParsedJd {
  return {
    text: jdText,
    keywords: extractKeywordsFromJd(jdText)
  }
}
