'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { buildVariants, segmentLongContent, type ShortVariant } from '../domain'
import { loadState, saveState } from './storage'

const SAMPLE = 'We used to ship feature work without clear checkpoints, then spend days debugging confusion across handoffs. The fix was small but strict: define one measurable outcome per week, review blockers midweek, and close with a short retrospective. That cadence made priorities obvious, reduced context switching, and improved delivery consistency. Most teams fail because they chase too many initiatives at once. Focused weekly loops outperform complex planning rituals.'

export function RepurposerStudio() {
  const [sourceText, setSourceText] = useState(SAMPLE)
  const [variants, setVariants] = useState<ShortVariant[]>([])
  const [platformFilter, setPlatformFilter] = useState<'all' | 'tiktok' | 'reels' | 'shorts'>('all')

  useEffect(() => {
    const state = loadState()
    if (state.sourceText) setSourceText(state.sourceText)
    if (state.variants.length > 0) setVariants(state.variants)
  }, [])

  useEffect(() => {
    saveState({ sourceText, variants })
  }, [sourceText, variants])

  const filtered = useMemo(() => {
    if (platformFilter === 'all') return variants
    return variants.filter((variant) => variant.platform === platformFilter)
  }, [platformFilter, variants])

  function generate(): void {
    const segments = segmentLongContent(sourceText, { targetSegments: 3, minWordsPerSegment: 30, maxWordsPerSegment: 85 })
    const generated = segments.flatMap((segment) => buildVariants(segment))
    setVariants(generated)
  }

  function updateVariant(id: string, nextBody: string): void {
    setVariants((prev) => prev.map((variant) => (variant.id === id ? { ...variant, body: nextBody } : variant)))
  }

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1100, padding: '1.5rem' }}>
      <h1>Content Repurposer</h1>
      <p>Convert long content into short standalone formats with hooks, timing, and hashtags.</p>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <h2>Source Content</h2>
        <textarea
          aria-label="source-content"
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
          rows={7}
          style={{ width: '100%', borderRadius: 8, border: '1px solid #a1a1aa', padding: '0.65rem' }}
        />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={generate}
            style={{ border: '1px solid #1d4ed8', background: '#1d4ed8', color: '#fff', borderRadius: 8, padding: '0.45rem 0.75rem' }}
          >
            Generate Variants
          </button>
          <select
            aria-label="platform-filter"
            value={platformFilter}
            onChange={(event) => setPlatformFilter(event.target.value as 'all' | 'tiktok' | 'reels' | 'shorts')}
            style={{ borderRadius: 8, border: '1px solid #a1a1aa', padding: '0.45rem 0.75rem' }}
          >
            <option value="all">All platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="reels">Reels</option>
            <option value="shorts">Shorts</option>
          </select>
        </div>
      </section>

      <section>
        <h2>Variants ({filtered.length})</h2>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {filtered.map((variant) => (
            <article key={variant.id} style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
              <p style={{ marginTop: 0, marginBottom: 6 }}>
                <strong>{variant.platform.toUpperCase()}</strong> | {variant.timingSeconds}s | {variant.standalone ? 'Standalone' : 'Needs context'}
              </p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Hook:</strong> {variant.hook}</p>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Body</label>
              <textarea
                aria-label={`variant-${variant.id}`}
                value={variant.body}
                onChange={(event) => updateVariant(variant.id, event.target.value)}
                rows={5}
                style={{ width: '100%', borderRadius: 8, border: '1px solid #a1a1aa', padding: '0.5rem' }}
              />
              <p><strong>CTA:</strong> {variant.cta}</p>
              <p><strong>Hashtags:</strong> {variant.hashtags.join(' ')}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
