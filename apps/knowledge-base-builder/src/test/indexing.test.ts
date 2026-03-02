import { describe, expect, it } from 'vitest'

import { chunkDocs } from '../domain/chunking'
import { dedupeChunks } from '../domain/dedupe'
import { parseDocsInput } from '../domain/ingestion'
import { searchChunks } from '../domain/kb_ui'

describe('indexing pipeline', () => {
  it('ingests, chunks, and dedupes documents', () => {
    const docs = parseDocsInput(`# A\nAlpha alpha alpha\n---\n# B\nAlpha alpha alpha`)
    const chunks = chunkDocs(docs, 3)
    const deduped = dedupeChunks(chunks)

    expect(docs.length).toBe(2)
    expect(chunks.length).toBeGreaterThan(0)
    expect(deduped.length).toBeLessThanOrEqual(chunks.length)
  })

  it('returns search results with citations', () => {
    const docs = parseDocsInput(`# Guide\nTypecheck is required before deploy`)
    const chunks = dedupeChunks(chunkDocs(docs, 20))
    const results = searchChunks(chunks, 'typecheck deploy')

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].citation).toContain('#chunk-')
  })
})
