'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  applyEpisodeTitles,
  chunkChecklistToEpisodes,
  exportPlanMarkdown,
  parseChecklistInput,
  type EpisodePlan
} from '../domain'
import { loadPlannerState, savePlannerState } from './storage'

const SAMPLE_CHECKLIST = `- Intro route setup 10m easy
- Find first collectible 12m
- Puzzle room A 20m
- Mini-boss hard 25m
- Side objective optional 10m
- Main boss hard 30m
- Cleanup and recap 15m`

export function EpisodePlannerStudio() {
  const [checklistText, setChecklistText] = useState(SAMPLE_CHECKLIST)
  const [targetMinutes, setTargetMinutes] = useState(35)
  const [episodes, setEpisodes] = useState<EpisodePlan[]>([])
  const [completedItemIds, setCompletedItemIds] = useState<string[]>([])
  const [exportText, setExportText] = useState('')

  useEffect(() => {
    const state = loadPlannerState()
    if (state.checklistText) setChecklistText(state.checklistText)
    if (state.targetMinutes) setTargetMinutes(state.targetMinutes)
    if (state.episodes.length > 0) setEpisodes(state.episodes)
    if (state.completedItemIds.length > 0) setCompletedItemIds(state.completedItemIds)
  }, [])

  useEffect(() => {
    savePlannerState({ checklistText, targetMinutes, episodes, completedItemIds })
  }, [checklistText, targetMinutes, episodes, completedItemIds])

  const totalItems = useMemo(() => episodes.flatMap((ep) => ep.items).length, [episodes])
  const completedCount = completedItemIds.length

  function buildPlan(): void {
    const parsed = parseChecklistInput(checklistText)
    const chunked = chunkChecklistToEpisodes(parsed, { targetMinutesPerEpisode: targetMinutes, maxItemsPerEpisode: 4 })
    const titled = applyEpisodeTitles(chunked)
    setEpisodes(titled)
    setExportText(exportPlanMarkdown(titled))
  }

  function toggleComplete(itemId: string): void {
    setCompletedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1150, padding: '1.5rem' }}>
      <h1>Walkthrough Episode Planner</h1>
      <p>Convert checklist objectives into realistic episode plans with pacing guidance.</p>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <h2>Checklist Input</h2>
        <textarea
          aria-label="checklist-input"
          value={checklistText}
          onChange={(event) => setChecklistText(event.target.value)}
          rows={8}
          style={{ width: '100%', borderRadius: 8, border: '1px solid #a1a1aa', padding: '0.6rem' }}
        />
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <label htmlFor="target">Target mins/episode</label>
          <input
            id="target"
            aria-label="target-minutes"
            type="number"
            min={15}
            max={90}
            value={targetMinutes}
            onChange={(event) => setTargetMinutes(Number(event.target.value) || 35)}
            style={{ width: 90, borderRadius: 8, border: '1px solid #a1a1aa', padding: '0.4rem' }}
          />
          <button
            type="button"
            onClick={buildPlan}
            style={{ border: '1px solid #1d4ed8', borderRadius: 8, background: '#1d4ed8', color: '#fff', padding: '0.45rem 0.8rem' }}
          >
            Build Episode Plan
          </button>
          <span>Progress: <strong>{completedCount}/{totalItems}</strong></span>
        </div>
      </section>

      <section>
        <h2>Episodes ({episodes.length})</h2>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
          {episodes.map((episode) => (
            <article key={episode.id} style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
              <h3 style={{ marginTop: 0 }}>{episode.title}</h3>
              <p>{episode.totalMinutes} min | pacing: <strong>{episode.pacing}</strong></p>
              <p style={{ color: '#334155' }}>{episode.notes.join(' ')}</p>
              <ul>
                {episode.items.map((item) => {
                  const done = completedItemIds.includes(item.id)
                  return (
                    <li key={item.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleComplete(item.id)}
                        />
                        {' '}
                        <span style={{ textDecoration: done ? 'line-through' : 'none' }}>
                          {item.text} ({item.estimatedMinutes}m)
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h2>Export</h2>
        <textarea aria-label="markdown-export" readOnly value={exportText} rows={10} style={{ width: '100%', borderRadius: 8, border: '1px solid #a1a1aa', padding: '0.6rem' }} />
      </section>
    </main>
  )
}
