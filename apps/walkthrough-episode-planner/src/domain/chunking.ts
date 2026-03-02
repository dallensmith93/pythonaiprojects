import type { ChecklistItem } from './checklist_import'
import { assessPacing, type PacingLevel } from './pacing_rules'

export interface EpisodePlan {
  id: string
  title: string
  items: ChecklistItem[]
  totalMinutes: number
  pacing: PacingLevel
  notes: string[]
}

export interface ChunkingOptions {
  targetMinutesPerEpisode?: number
  maxItemsPerEpisode?: number
}

export function chunkChecklistToEpisodes(items: ChecklistItem[], options: ChunkingOptions = {}): EpisodePlan[] {
  const target = Math.max(15, options.targetMinutesPerEpisode ?? 35)
  const maxItems = Math.max(2, options.maxItemsPerEpisode ?? 4)

  const episodes: EpisodePlan[] = []
  let bucket: ChecklistItem[] = []
  let minutes = 0

  for (const item of items) {
    const nextMinutes = minutes + item.estimatedMinutes
    const shouldSplit = bucket.length >= maxItems || (nextMinutes > target && bucket.length > 0)

    if (shouldSplit) {
      const pacing = assessPacing(minutes, target)
      episodes.push({
        id: `ep-${episodes.length + 1}`,
        title: `Episode ${episodes.length + 1}`,
        items: bucket,
        totalMinutes: minutes,
        pacing: pacing.pacing,
        notes: pacing.notes
      })
      bucket = [item]
      minutes = item.estimatedMinutes
    } else {
      bucket.push(item)
      minutes = nextMinutes
    }
  }

  if (bucket.length > 0) {
    const pacing = assessPacing(minutes, target)
    episodes.push({
      id: `ep-${episodes.length + 1}`,
      title: `Episode ${episodes.length + 1}`,
      items: bucket,
      totalMinutes: minutes,
      pacing: pacing.pacing,
      notes: pacing.notes
    })
  }

  return episodes
}
