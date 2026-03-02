'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  checkConsistency,
  generateApiSchema,
  generatePrd,
  generateStarterRepo,
  generateUiSkeleton
} from '../domain'
import { loadSpecRecords, saveSpecRecords, type SpecRecord } from './storage'

type TabKey = 'prd' | 'api' | 'ui' | 'repo' | 'consistency'

export function SpecBuilderStudio() {
  const [idea, setIdea] = useState('Team incident workflow planner')
  const [activeTab, setActiveTab] = useState<TabKey>('prd')
  const [history, setHistory] = useState<SpecRecord[]>([])

  useEffect(() => {
    setHistory(loadSpecRecords())
  }, [])

  const prd = useMemo(() => generatePrd(idea), [idea])
  const api = useMemo(() => generateApiSchema(idea), [idea])
  const ui = useMemo(() => generateUiSkeleton(idea), [idea])
  const repo = useMemo(() => generateStarterRepo(api, ui), [api, ui])
  const consistency = useMemo(() => checkConsistency(prd, api, ui), [prd, api, ui])

  function generate(): void {
    const next = [{ idea, createdAt: Date.now() }, ...history].slice(0, 12)
    setHistory(next)
    saveSpecRecords(next)
  }

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1140, padding: '1.5rem' }}>
      <h1>Spec Builder</h1>
      <p>Generate PRD, API schema, and UI skeleton from a feature idea.</p>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <label htmlFor="idea">Feature idea</label>
        <input id="idea" aria-label="idea-input" value={idea} onChange={(e) => setIdea(e.target.value)} style={{ width: '100%', marginTop: 6, border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.55rem' }} />
        <button type="button" onClick={generate} style={{ marginTop: '0.7rem', border: '1px solid #1d4ed8', background: '#1d4ed8', color: '#fff', borderRadius: 8, padding: '0.35rem 0.75rem' }}>
          Generate Outputs
        </button>
      </section>

      <section style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
        {(['prd', 'api', 'ui', 'repo', 'consistency'] as TabKey[]).map((tab) => (
          <button
            key={tab}
            type="button"
            aria-label={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            style={{
              border: '1px solid #a1a1aa',
              borderRadius: 8,
              padding: '0.3rem 0.65rem',
              background: activeTab === tab ? '#e0f2fe' : '#fff'
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </section>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.9rem', minHeight: 260 }}>
        {activeTab === 'prd' && (
          <div>
            <h2>{prd.title}</h2>
            <p>{prd.problem}</p>
            <h3>Goals</h3>
            <ul>{prd.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
          </div>
        )}

        {activeTab === 'api' && (
          <div>
            <h2>{api.service}</h2>
            <ul>
              {api.endpoints.map((endpoint) => (
                <li key={`${endpoint.method}-${endpoint.path}`}>
                  <strong>{endpoint.method}</strong> {endpoint.path}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'ui' && (
          <div>
            <h2>UI Skeleton</h2>
            <p>Pages: {ui.pages.join(', ')}</p>
            <p>Components: {ui.components.join(', ')}</p>
          </div>
        )}

        {activeTab === 'repo' && (
          <div>
            <h2>Starter Repo</h2>
            <ul>{repo.files.map((file) => <li key={file}>{file}</li>)}</ul>
          </div>
        )}

        {activeTab === 'consistency' && (
          <div>
            <h2>Consistency</h2>
            <p>Status: <strong>{consistency.aligned ? 'Aligned' : 'Needs fixes'}</strong></p>
            <ul>{consistency.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
          </div>
        )}
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h2>Recent Specs ({history.length})</h2>
        <ul>
          {history.map((item) => (
            <li key={item.createdAt}>{item.idea}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
