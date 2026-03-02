'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  chunkDocs,
  dedupeChunks,
  detectSimpleContradictions,
  parseDocsInput,
  searchChunks,
  type DocChunk,
  type SourceDoc
} from '../domain'
import { loadKBState, saveKBState } from './storage'

const SAMPLE = `# Deployment Guide
Always run typecheck before production deploy. Rollback is optional for staging.
---
# Incident SOP
Never skip rollback preparation during release windows. Typecheck is required before deploy.`

export function KBStudio() {
  const [rawDocs, setRawDocs] = useState(SAMPLE)
  const [docs, setDocs] = useState<SourceDoc[]>([])
  const [chunks, setChunks] = useState<DocChunk[]>([])
  const [query, setQuery] = useState('typecheck deploy')

  useEffect(() => {
    const state = loadKBState()
    if (state.docs.length > 0) setDocs(state.docs)
    if (state.chunks.length > 0) setChunks(state.chunks)
  }, [])

  useEffect(() => {
    saveKBState({ docs, chunks })
  }, [docs, chunks])

  const results = useMemo(() => searchChunks(chunks, query), [chunks, query])
  const contradictions = useMemo(() => detectSimpleContradictions(chunks), [chunks])

  function ingest(): void {
    const parsed = parseDocsInput(rawDocs)
    const chunked = chunkDocs(parsed)
    const deduped = dedupeChunks(chunked)
    setDocs(parsed)
    setChunks(deduped)
  }

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1150, padding: '1.5rem' }}>
      <h1>Knowledge Base Builder</h1>
      <p>Ingest docs, build a chunk index, and search with citations.</p>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <h2>Ingestion</h2>
        <textarea aria-label="docs-input" value={rawDocs} onChange={(e) => setRawDocs(e.target.value)} rows={8} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.55rem' }} />
        <button type="button" onClick={ingest} style={{ marginTop: '0.7rem', border: '1px solid #1d4ed8', background: '#1d4ed8', color: '#fff', borderRadius: 8, padding: '0.35rem 0.75rem' }}>
          Ingest + Index
        </button>
        <p>Docs: <strong>{docs.length}</strong> | Chunks: <strong>{chunks.length}</strong></p>
      </section>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Search</h2>
          <input aria-label="search-input" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.45rem' }} />
          <ul>
            {results.map((result) => (
              <li key={result.chunkId}>
                <strong>{result.docTitle}</strong>: {result.snippet}
                <div><code>{result.citation}</code></div>
              </li>
            ))}
          </ul>
        </article>

        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Doc Viewer</h2>
          {docs.map((doc) => (
            <div key={doc.id} style={{ marginBottom: '0.6rem' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>{doc.title}</h3>
              <p style={{ margin: 0 }}>{doc.content.slice(0, 220)}</p>
            </div>
          ))}
        </article>
      </section>

      <section style={{ marginTop: '1rem', border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
        <h2>Contradiction Warnings ({contradictions.length})</h2>
        <ul>
          {contradictions.map((warning, idx) => (
            <li key={idx}>{warning.reason} [{warning.leftCitation}] vs [{warning.rightCitation}]</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
