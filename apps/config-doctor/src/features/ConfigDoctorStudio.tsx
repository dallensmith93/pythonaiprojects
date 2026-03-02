'use client'

import React, { useMemo, useState } from 'react'

import {
  buildFixPlans,
  matchRules,
  renderSafeScript,
  runDiagnostics,
  type EnvSnapshot,
  type FixPlan
} from '../domain'
import { loadSnapshots, saveSnapshots } from './storage'

const DEFAULT: EnvSnapshot = {
  os: 'windows',
  nodeInstalled: true,
  pnpmInstalled: false,
  gitInstalled: true,
  pythonInstalled: true,
  envPathHealthy: true
}

export function ConfigDoctorStudio() {
  const initialHistory = useMemo(() => loadSnapshots(), [])
  const [snapshot, setSnapshot] = useState<EnvSnapshot>(DEFAULT)
  const [plans, setPlans] = useState<FixPlan[]>([])
  const [history, setHistory] = useState<EnvSnapshot[]>(initialHistory)

  function diagnose(): void {
    const issues = runDiagnostics(snapshot)
    const matches = matchRules(issues)
    const nextPlans = buildFixPlans(matches)
    setPlans(nextPlans)

    const nextHistory = [snapshot, ...history].slice(0, 10)
    setHistory(nextHistory)
    saveSnapshots(nextHistory)
  }

  function toggle<K extends keyof EnvSnapshot>(key: K): void {
    if (key === 'os') return
    setSnapshot((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1080, padding: '1.5rem' }}>
      <h1>Config Doctor</h1>
      <p>Diagnose local dev environment issues and generate safe fix checklists.</p>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <h2>Diagnostic Checklist</h2>
        <label>
          OS
          <select value={snapshot.os} onChange={(event) => setSnapshot((prev) => ({ ...prev, os: event.target.value as EnvSnapshot['os'] }))} style={{ marginLeft: 8 }}>
            <option value="windows">Windows</option>
            <option value="mac">macOS</option>
            <option value="linux">Linux</option>
          </select>
        </label>
        <div style={{ display: 'grid', marginTop: '0.75rem', gap: '0.4rem' }}>
          {(['nodeInstalled', 'pnpmInstalled', 'gitInstalled', 'pythonInstalled', 'envPathHealthy'] as const).map((key) => (
            <label key={key}>
              <input type="checkbox" checked={snapshot[key]} onChange={() => toggle(key)} /> {key}
            </label>
          ))}
        </div>
        <button type="button" onClick={diagnose} style={{ marginTop: '0.75rem', border: '1px solid #1d4ed8', borderRadius: 8, background: '#1d4ed8', color: '#fff', padding: '0.35rem 0.75rem' }}>
          Run Diagnosis
        </button>
      </section>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Fix Plans ({plans.length})</h2>
          {plans.length === 0 ? (
            <p>No issues detected.</p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} style={{ marginBottom: '0.8rem', borderTop: '1px solid #e4e4e7', paddingTop: '0.5rem' }}>
                <p><strong>{plan.title}</strong> {plan.safe ? '(safe)' : '(review required)'}</p>
                <p>{plan.rationale}</p>
                <ol>
                  {plan.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <textarea readOnly aria-label={`script-${plan.id}`} rows={5} value={renderSafeScript(plan)} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.5rem' }} />
              </div>
            ))
          )}
        </article>

        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Saved Snapshots ({history.length})</h2>
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>{item.os} | node:{String(item.nodeInstalled)} pnpm:{String(item.pnpmInstalled)} path:{String(item.envPathHealthy)}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}
