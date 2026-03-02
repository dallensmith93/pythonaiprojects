import type { DocChunk } from './chunking'

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function dedupeChunks(chunks: DocChunk[]): DocChunk[] {
  const seen = new Set<string>()
  const unique: DocChunk[] = []

  for (const chunk of chunks) {
    const key = normalize(chunk.text)
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(chunk)
  }

  return unique
}
