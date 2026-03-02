'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  buildHighlightSpans,
  buildRewriteSuggestions,
  DEFAULT_RULES,
  lintDraft,
  scoreViolations,
  type HighlightSpan,
  type LintRules
} from '../domain'
import { loadRules, saveRules } from './storage'

const SAMPLE = 'This proposal should be done ASAP and is obviously the best path. We will share details tomorrow.'

function parseListInput(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function renderWithHighlights(text: string, spans: HighlightSpan[]): React.ReactNode {
  if (spans.length === 0 || text.length === 0) return text

  const nodes: React.ReactNode[] = []
  let cursor = 0

  spans.forEach((span, idx) => {
    const start = Math.max(cursor, span.start)
    const end = Math.min(text.length, span.end)
    if (start > cursor) nodes.push(<span key={`plain-${idx}`}>{text.slice(cursor, start)}</span>)
    if (end > start) {
      const bg = span.severity === 'high' ? '#fecaca' : span.severity === 'medium' ? '#fde68a' : '#bfdbfe'
      nodes.push(
        <mark key={`mark-${idx}`} style={{ background: bg, padding: 0 }}>
          {text.slice(start, end)}
        </mark>
      )
    }
    cursor = Math.max(cursor, end)
  })

  if (cursor < text.length) nodes.push(<span key="tail">{text.slice(cursor)}</span>)
  return <>{nodes}</>
}

export function ComplianceLinterStudio() {
  const [draft, setDraft] = useState(SAMPLE)
  const [rules, setRules] = useState<LintRules>(DEFAULT_RULES)

  useEffect(() => {
    setRules(loadRules(DEFAULT_RULES))
  }, [])

  useEffect(() => {
    saveRules(rules)
  }, [rules])

  const violations = useMemo(() => lintDraft(draft, rules), [draft, rules])
  const score = useMemo(() => scoreViolations(violations), [violations])
  const spans = useMemo(() => buildHighlightSpans(violations), [violations])
  const suggestions = useMemo(() => buildRewriteSuggestions(violations), [violations])

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1160, padding: '1.5rem' }}>
      <h1>Compliance Linter</h1>
      <p>Check draft writing against configurable rules and get actionable suggestions.</p>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Editor</h2>
          <textarea
            aria-label="draft-editor"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={10}
            style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.55rem' }}
          />
          <p style={{ marginTop: 8 }}><strong>Score:</strong> {score.score}</p>
        </article>

        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Rules</h2>
          <label>
            Max words
            <input aria-label="rule-maxwords" type="number" min={20} value={rules.maxWords} onChange={(e) => setRules((prev) => ({ ...prev, maxWords: Number(e.target.value) || 120 }))} style={{ marginLeft: 8, width: 90 }} />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Banned phrases (comma-separated)
            <input
              aria-label="rule-banned"
              value={rules.bannedPhrases.join(', ')}
              onChange={(e) => setRules((prev) => ({ ...prev, bannedPhrases: parseListInput(e.target.value) }))}
              style={{ width: '100%', marginTop: 4 }}
            />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Required phrases (comma-separated)
            <input
              aria-label="rule-required"
              value={rules.requiredPhrases.join(', ')}
              onChange={(e) => setRules((prev) => ({ ...prev, requiredPhrases: parseListInput(e.target.value) }))}
              style={{ width: '100%', marginTop: 4 }}
            />
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Tone
            <select aria-label="rule-tone" value={rules.tone} onChange={(e) => setRules((prev) => ({ ...prev, tone: e.target.value as LintRules['tone'] }))} style={{ marginLeft: 8 }}>
              <option value="neutral">neutral</option>
              <option value="formal">formal</option>
            </select>
          </label>
        </article>
      </section>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: '1rem' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Highlights</h2>
          <div aria-label="highlight-preview" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {renderWithHighlights(draft, spans)}
          </div>
        </article>

        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Issues ({violations.length})</h2>
          <ul>
            {violations.map((v) => (
              <li key={v.id}>[{v.severity}] {v.message}</li>
            ))}
          </ul>
          <h3>Suggestions</h3>
          <ul>
            {suggestions.map((s) => (
              <li key={s.violationId}>{s.suggestion}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}
