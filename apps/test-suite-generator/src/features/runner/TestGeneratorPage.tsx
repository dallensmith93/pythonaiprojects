'use client'

import React, { useMemo } from 'react'

import { selectDerived, testActions, useTestStore } from '../state/testStore'

export function TestGeneratorPage() {
  const state = useTestStore((s) => s)
  const derived = useMemo(() => selectDerived(state), [state])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1200 }}>
      <h1>Test Suite Generator + Flake Detector</h1>
      <p>Generate tests from flows, run them repeatedly, and flag flaky tests from history patterns.</p>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <button type='button' onClick={() => testActions.regenerateTests()}>Regenerate Tests</button>
        <button type='button' onClick={() => testActions.reset()} style={{ marginLeft: 8 }}>Reset</button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Generated Tests</h2>
          {state.tests.map((test) => (
            <article key={test.id} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 8, marginBottom: 8 }}>
              <h3>{test.title}</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{test.body}</pre>
              <button type='button' onClick={() => testActions.appendRun(test.id, true, 0)}>Run Pass</button>
              <button type='button' onClick={() => testActions.appendRun(test.id, false, 0)} style={{ marginLeft: 6 }}>Run Fail</button>
              <button type='button' onClick={() => testActions.appendRun(test.id, true, 2)} style={{ marginLeft: 6 }}>Run With Retries</button>
            </article>
          ))}
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Run History + Flake Scores</h2>
          <ul>
            {derived.flakeScores.map((score) => (
              <li key={score.testId}>
                <strong>{score.testId}</strong>: score {score.score} [{score.level}] - {score.reason}
              </li>
            ))}
          </ul>

          <h3>Quarantine Recommendations</h3>
          {derived.quarantine.length === 0 ? (
            <p>No tests currently recommended for quarantine.</p>
          ) : (
            <ul>
              {derived.quarantine.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          )}

          <h3>Recent Runs</h3>
          <ul>
            {state.history.slice(-12).map((run, idx) => (
              <li key={`${run.testId}-${run.runAtIso}-${idx}`}>
                {run.runAtIso} - {run.testId} - {run.passed ? 'pass' : 'fail'} - retries {run.retries}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
