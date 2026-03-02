import type { ShortVariant } from '../domain/variants'

const KEY = 'content-repurposer.variants.v1'

export interface SavedRepurposerState {
  sourceText: string
  variants: ShortVariant[]
}

export function loadState(): SavedRepurposerState {
  if (typeof window === 'undefined') return { sourceText: '', variants: [] }

  const raw = window.localStorage.getItem(KEY)
  if (!raw) return { sourceText: '', variants: [] }

  try {
    const parsed = JSON.parse(raw) as SavedRepurposerState
    return {
      sourceText: typeof parsed.sourceText === 'string' ? parsed.sourceText : '',
      variants: Array.isArray(parsed.variants) ? parsed.variants : []
    }
  } catch {
    return { sourceText: '', variants: [] }
  }
}

export function saveState(state: SavedRepurposerState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(state))
}
