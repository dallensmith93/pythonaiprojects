'use client'

import React, { useEffect, useState } from 'react'

import {
  buildAnswerKey,
  difficultyLabel,
  generateProblemSet,
  scaleProblemCount,
  toPrintableAnswerKey,
  toPrintableWorksheet,
  type AnswerKeyItem,
  type ProblemSet
} from '../domain'
import { loadWorksheets, saveWorksheets, type StoredWorksheet } from './storage'

export function WorksheetStudio() {
  const [title, setTitle] = useState('Scaled Copies Practice Set')
  const [level, setLevel] = useState<1 | 2 | 3>(1)
  const [baseCount, setBaseCount] = useState(8)
  const [currentSet, setCurrentSet] = useState<ProblemSet | null>(null)
  const [answers, setAnswers] = useState<AnswerKeyItem[]>([])
  const [history, setHistory] = useState<StoredWorksheet[]>([])

  useEffect(() => {
    setHistory(loadWorksheets())
  }, [])

  useEffect(() => {
    saveWorksheets(history)
  }, [history])

  function generate(): void {
    const count = scaleProblemCount(baseCount, level)
    const set = generateProblemSet(title, level, count)
    const key = buildAnswerKey(set.problems)
    setCurrentSet(set)
    setAnswers(key)
    setHistory((prev) => [{ set, answers: key }, ...prev].slice(0, 10))
  }

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1100, padding: '1.5rem' }}>
      <h1>Scaled Copies Worksheet Generator</h1>
      <p>Generate math problem sets and answer keys with scalable difficulty.</p>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <h2>Worksheet Setup</h2>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <label>
            Title
            <input aria-label="worksheet-title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.45rem' }} />
          </label>
          <label>
            Level
            <select aria-label="difficulty-level" value={level} onChange={(e) => setLevel(Number(e.target.value) as 1 | 2 | 3)} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.45rem' }}>
              <option value={1}>1 - Foundational</option>
              <option value={2}>2 - Practice</option>
              <option value={3}>3 - Challenge</option>
            </select>
          </label>
          <label>
            Base count
            <input aria-label="base-count" type="number" min={3} max={30} value={baseCount} onChange={(e) => setBaseCount(Number(e.target.value) || 8)} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.45rem' }} />
          </label>
        </div>
        <button type="button" onClick={generate} style={{ marginTop: '0.75rem', border: '1px solid #1d4ed8', background: '#1d4ed8', color: '#fff', borderRadius: 8, padding: '0.45rem 0.8rem' }}>
          Generate Problems
        </button>
      </section>

      {currentSet && (
        <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
            <h2 style={{ marginTop: 0 }}>{currentSet.title}</h2>
            <p>Level: <strong>{difficultyLabel(currentSet.level)}</strong> | Problems: <strong>{currentSet.problems.length}</strong></p>
            <ol>
              {currentSet.problems.map((problem) => (
                <li key={problem.id}>{problem.prompt}</li>
              ))}
            </ol>
            <textarea aria-label="worksheet-print" readOnly value={toPrintableWorksheet(currentSet)} rows={8} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.5rem' }} />
          </article>

          <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
            <h2 style={{ marginTop: 0 }}>Answer Key</h2>
            <ul>
              {answers.map((a) => (
                <li key={a.id}>{a.id}: {a.answer}</li>
              ))}
            </ul>
            <textarea aria-label="answerkey-print" readOnly value={toPrintableAnswerKey(answers)} rows={8} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.5rem' }} />
          </article>
        </section>
      )}

      <section style={{ marginTop: '1rem' }}>
        <h2>Saved Sets ({history.length})</h2>
        <ul>
          {history.map((entry) => (
            <li key={entry.set.id}>{entry.set.title} - {entry.set.problems.length} problems</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
