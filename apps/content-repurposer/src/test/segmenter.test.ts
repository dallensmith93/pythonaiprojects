import { describe, expect, it } from 'vitest'

import { segmentLongContent } from '../domain/segmenter'

const LONG_TEXT = `Our team struggled to turn long educational content into short clips that still made sense on their own. We fixed that by defining one main idea per clip, writing a strong first line, and ending with a direct action step. Then we measured average watch completion and rewrote weak openings every week. The result was fewer abandoned videos and much stronger engagement across platforms. We also discovered that each short needed enough context to avoid references to previous parts.`

describe('segmentLongContent', () => {
  it('creates multiple segments from long text', () => {
    const segments = segmentLongContent(LONG_TEXT, { targetSegments: 3, maxWordsPerSegment: 40 })

    expect(segments.length).toBeGreaterThan(1)
    expect(segments[0].wordCount).toBeGreaterThan(20)
  })

  it('adds standalone lead when segment starts with weak context pronouns', () => {
    const segments = segmentLongContent('This approach works because teams review one metric each week. It keeps focus high.')

    expect(segments[0].text.startsWith('Key context:')).toBe(true)
  })
})
