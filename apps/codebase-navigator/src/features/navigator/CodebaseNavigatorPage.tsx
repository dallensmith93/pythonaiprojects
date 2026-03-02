'use client'

import React, { useMemo, useState } from 'react'

import { navigatorActions, selectDerived, useNavigatorStore } from '../state/navigatorStore'

export function CodebaseNavigatorPage() {
  const state = useNavigatorStore((s) => s)
  const derived = useMemo(() => selectDerived(state), [state])
  const [pathInput, setPathInput] = useState('src/features/new/File.ts')
  const [contentInput, setContentInput] = useState("export function placeholder() { return 'ok' }")

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1280 }}>
      <h1>Codebase Navigator Agent</h1>
      <p>Index files, map dependencies, and answer ?where to change X?? with file references.</p>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <h2>Query</h2>
        <input
          style={{ width: '60%' }}
          value={state.query}
          onChange={(event) => navigatorActions.setQuery(event.target.value)}
        />
        <button type='button' onClick={() => navigatorActions.reindex()} style={{ marginLeft: 8 }}>Reindex</button>
        <button type='button' onClick={() => navigatorActions.resetSeed()} style={{ marginLeft: 8 }}>Reset Seed</button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>File Tree</h2>
          <ul>
            {derived.files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Dependency Graph</h2>
          {derived.edges.length === 0 ? (
            <p>No internal dependency edges found.</p>
          ) : (
            <ul>
              {derived.edges.map((edge) => (
                <li key={`${edge.from}-${edge.to}-${edge.line}`}>
                  {edge.from} {'->'} {edge.to} (line {edge.line})
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginTop: 12 }}>
        <h2>Where to Change Answer</h2>
        <p>{derived.answer.summary}</p>
        <ul>
          {derived.answer.references.map((ref) => (
            <li key={`${ref.path}:${ref.line}`}>
              {ref.path}:{ref.line} - {ref.reason}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginTop: 12 }}>
        <h2>Add Document to Index</h2>
        <input value={pathInput} onChange={(event) => setPathInput(event.target.value)} style={{ width: '60%' }} />
        <textarea
          value={contentInput}
          onChange={(event) => setContentInput(event.target.value)}
          rows={4}
          style={{ width: '100%', marginTop: 8 }}
        />
        <button type='button' onClick={() => navigatorActions.addDocument(pathInput, contentInput)}>Add + Reindex</button>
      </section>
    </main>
  )
}
