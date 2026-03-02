import { describe, expect, it } from 'vitest'

import { parseChecklistInput } from '../domain/checklist_import'
import { chunkChecklistToEpisodes } from '../domain/chunking'

describe('chunkChecklistToEpisodes', () => {
  it('splits checklist into multiple episodes based on target minutes', () => {
    const items = parseChecklistInput(`
- Intro route setup 10m
- Puzzle A 20m
- Puzzle B 20m
- Boss hard 30m
- Cleanup 10m
`)

    const episodes = chunkChecklistToEpisodes(items, { targetMinutesPerEpisode: 35 })

    expect(episodes.length).toBeGreaterThan(1)
    expect(episodes[0].totalMinutes).toBeLessThanOrEqual(35)
  })

  it('flags heavy pacing when episode exceeds target window', () => {
    const items = parseChecklistInput(`
- Large dungeon hard 30m
- Main boss hard 35m
`)

    const episodes = chunkChecklistToEpisodes(items, { targetMinutesPerEpisode: 40, maxItemsPerEpisode: 3 })

    expect(episodes.some((episode) => episode.pacing === 'heavy' || episode.pacing === 'balanced')).toBe(true)
  })
})
