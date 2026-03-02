import { suggestHashtags } from './hashtagging'
import { generateHooks } from './hook_engine'
import type { ContentSegment } from './segmenter'
import { estimateTiming } from './timing'

export type Platform = 'tiktok' | 'reels' | 'shorts'

export interface ShortVariant {
  id: string
  segmentId: string
  platform: Platform
  hook: string
  body: string
  cta: string
  hashtags: string[]
  timingSeconds: number
  standalone: boolean
}

export function isStandaloneText(text: string): boolean {
  const trimmed = text.trim().toLowerCase()
  if (trimmed.length < 80) return false
  if (trimmed.startsWith('this ') || trimmed.startsWith('it ') || trimmed.startsWith('they ')) return false
  return true
}

export function buildVariants(segment: ContentSegment, platforms: Platform[] = ['tiktok', 'reels', 'shorts']): ShortVariant[] {
  const hooks = generateHooks(segment)

  return platforms.map((platform, idx) => {
    const hook = hooks[idx % hooks.length]
    const body = `${segment.text}`
    const cta = platform === 'shorts'
      ? 'Save this and apply one step today.'
      : 'Comment your next step and follow for the next part.'
    const composite = `${hook} ${body} ${cta}`
    const timing = estimateTiming(composite)

    return {
      id: `${segment.id}-${platform}`,
      segmentId: segment.id,
      platform,
      hook,
      body,
      cta,
      hashtags: suggestHashtags(segment.text),
      timingSeconds: timing.seconds,
      standalone: isStandaloneText(composite)
    }
  })
}
