import type { ContentSegment } from './segmenter'

export type HookStyle = 'question' | 'contrarian' | 'howto' | 'urgency'

function extractFocusPhrase(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)

  const counts = new Map<string, number>()
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1)

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1])
  return ranked[0]?.[0] ?? 'your topic'
}

export function generateHooks(segment: ContentSegment, styles: HookStyle[] = ['question', 'contrarian', 'howto']): string[] {
  const focus = extractFocusPhrase(segment.text)
  const hooks: string[] = []

  for (const style of styles) {
    if (style === 'question') hooks.push(`Still struggling with ${focus}? Try this.`)
    if (style === 'contrarian') hooks.push(`Stop overcomplicating ${focus}. Keep it simple.`)
    if (style === 'howto') hooks.push(`How to improve ${focus} in one short session.`)
    if (style === 'urgency') hooks.push(`Fix your ${focus} workflow before it costs you another week.`)
  }

  return hooks.slice(0, 3)
}
