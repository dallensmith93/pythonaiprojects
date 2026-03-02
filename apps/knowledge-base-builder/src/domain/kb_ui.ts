import type { DocChunk } from './chunking'

export interface SearchResult {
  chunkId: string
  score: number
  snippet: string
  citation: string
  docTitle: string
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(Boolean)
}

export function searchChunks(chunks: DocChunk[], query: string): SearchResult[] {
  const q = tokenize(query)
  if (q.length === 0) return []

  return chunks
    .map((chunk) => {
      const tokens = tokenize(chunk.text)
      const overlap = q.filter((term) => tokens.includes(term)).length
      const score = overlap / q.length
      return {
        chunkId: chunk.id,
        score,
        snippet: chunk.text.slice(0, 220),
        citation: chunk.citation,
        docTitle: chunk.docTitle
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}
