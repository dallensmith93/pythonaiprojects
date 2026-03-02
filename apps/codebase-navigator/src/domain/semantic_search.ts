import type { CodebaseIndex } from './indexer'

export interface SearchHit {
  path: string
  score: number
  matchedTokens: string[]
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9_./-\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2)
}

export function semanticSearch(index: CodebaseIndex, query: string, limit = 5): SearchHit[] {
  const terms = tokenize(query)
  const hits: SearchHit[] = []

  for (const [path, embedding] of Object.entries(index.embeddings)) {
    let score = 0
    const matched: string[] = []

    for (const term of terms) {
      if (embedding[term]) {
        score += embedding[term]
        matched.push(term)
      }
    }

    if (score > 0) {
      hits.push({ path, score, matchedTokens: matched })
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}
