'use client'

import React, { useMemo, useState } from 'react'

import { tailorActions, selectDerived, useTailorStore } from '../state/tailorStore'

export function ResumeTailorPage() {
  const state = useTailorStore((s) => s)
  const derived = useMemo(() => selectDerived(state), [state])
  const [edited, setEdited] = useState<Record<string, string>>({})

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1280 }}>
      <h1>Resume + JD Tailor</h1>
      <p>Tailor resume bullets to job descriptions with explicit no-fabrication safety checks.</p>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Resume Input</h2>
          <textarea
            rows={10}
            style={{ width: '100%' }}
            value={state.resumeText}
            onChange={(event) => tailorActions.setResumeText(event.target.value)}
          />
        </section>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Job Description Input</h2>
          <textarea
            rows={10}
            style={{ width: '100%' }}
            value={state.jdText}
            onChange={(event) => tailorActions.setJdText(event.target.value)}
          />
        </section>
      </section>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginTop: 12 }}>
        <h2>Keyword Coverage</h2>
        <p>Match score: {derived.coverage.scorePercent}%</p>
        <p>Matched: {derived.coverage.matched.join(', ') || 'none'}</p>
        <p>Missing: {derived.coverage.missing.join(', ') || 'none'}</p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Diff View</h2>
          {derived.suggestions.map((suggestion, index) => (
            <article key={suggestion.bulletId} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 8, marginBottom: 8 }}>
              <p><strong>Original:</strong> {suggestion.original}</p>
              <p><strong>Suggested:</strong> {suggestion.rewritten}</p>
              {suggestion.blocked ? (
                <p style={{ color: '#b91c1c' }}>
                  Blocked: {suggestion.blockReason}
                </p>
              ) : (
                <p style={{ color: '#166534' }}>Added keywords: {suggestion.addedKeywords.join(', ') || 'none'}</p>
              )}
              <small>Diff lines: {derived.diffs[index].map((line) => `${line.type}:${line.value}`).join(' | ')}</small>
            </article>
          ))}
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Editing Panel</h2>
          {derived.suggestions.map((suggestion) => (
            <div key={suggestion.bulletId} style={{ marginBottom: 8 }}>
              <label>
                {suggestion.bulletId}
                <textarea
                  rows={3}
                  style={{ width: '100%' }}
                  value={edited[suggestion.bulletId] ?? suggestion.rewritten}
                  onChange={(event) => setEdited((prev) => ({ ...prev, [suggestion.bulletId]: event.target.value }))}
                  disabled={suggestion.blocked}
                />
              </label>
            </div>
          ))}

          <button
            type='button'
            onClick={() => {
              const tailored = derived.suggestions.map((suggestion) => edited[suggestion.bulletId] ?? suggestion.rewritten)
              tailorActions.createVersion(tailored)
            }}
          >
            Save Version
          </button>
          <button type='button' onClick={() => tailorActions.reset()} style={{ marginLeft: 8 }}>Reset</button>

          <h3>Versions</h3>
          <ul>
            {state.versions.map((version) => (
              <li key={version.id}>
                <button type='button' onClick={() => tailorActions.selectVersion(version.id)}>{version.id}</button> {version.createdAtIso}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
