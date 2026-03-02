import type { DocChunk, SourceDoc } from '../domain'

const KEY = 'knowledge-base-builder.state.v1'

export interface KBState {
  docs: SourceDoc[]
  chunks: DocChunk[]
}

export function loadKBState(): KBState {
  if (typeof window === 'undefined') return { docs: [], chunks: [] }
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return { docs: [], chunks: [] }
  try {
    const parsed = JSON.parse(raw) as KBState
    return {
      docs: Array.isArray(parsed.docs) ? parsed.docs : [],
      chunks: Array.isArray(parsed.chunks) ? parsed.chunks : []
    }
  } catch {
    return { docs: [], chunks: [] }
  }
}

export function saveKBState(state: KBState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(state))
}
