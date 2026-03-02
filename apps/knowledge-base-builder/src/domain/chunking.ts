import type { SourceDoc } from './ingestion'

export interface DocChunk {
  id: string
  docId: string
  docTitle: string
  text: string
  citation: string
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

export function chunkDocs(docs: SourceDoc[], chunkSize = 60): DocChunk[] {
  const chunks: DocChunk[] = []

  for (const doc of docs) {
    const tokens = words(doc.content)
    let idx = 0
    let chunkNo = 1

    while (idx < tokens.length) {
      const slice = tokens.slice(idx, idx + chunkSize)
      if (slice.length === 0) break
      chunks.push({
        id: `${doc.id}-c${chunkNo}`,
        docId: doc.id,
        docTitle: doc.title,
        text: slice.join(' '),
        citation: `${doc.title}#chunk-${chunkNo}`
      })
      idx += chunkSize
      chunkNo += 1
    }
  }

  return chunks
}
