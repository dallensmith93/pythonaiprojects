import type { CodebaseIndex } from './indexer'
import { semanticSearch } from './semantic_search'

export interface ChangeAnswer {
  query: string
  summary: string
  references: Array<{ path: string; line: number; reason: string }>
}

export function answerWhereToChange(index: CodebaseIndex, query: string): ChangeAnswer {
  const hits = semanticSearch(index, query, 5)
  const refs = hits.map((hit) => {
    const symbolMatch = index.symbols.find((symbol) => symbol.path === hit.path)
    return {
      path: hit.path,
      line: symbolMatch?.line ?? 1,
      reason: `Matched terms: ${hit.matchedTokens.join(', ')}`
    }
  })

  const summary = refs.length === 0
    ? 'No strong match found. Refine query with symbol/module names.'
    : `Top candidate files for "${query}" are ranked by token overlap.`

  return {
    query,
    summary,
    references: refs
  }
}
