export interface ContentSegment {
  id: string
  title: string
  text: string
  wordCount: number
}

export interface SegmentOptions {
  targetSegments?: number
  minWordsPerSegment?: number
  maxWordsPerSegment?: number
}

function toWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function normalize(input: string): string {
  return input
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function sentenceSplit(text: string): string[] {
  const byPunctuation = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (byPunctuation.length > 1) return byPunctuation

  return text
    .split(/,\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function standaloneLead(text: string): string {
  const lowered = text.trim().toLowerCase()
  if (lowered.startsWith('this ') || lowered.startsWith('it ') || lowered.startsWith('they ')) {
    return `Key context: ${text}`
  }
  return text
}

function titleFrom(text: string): string {
  const words = toWords(text).slice(0, 7)
  return words.join(' ')
}

export function segmentLongContent(input: string, options: SegmentOptions = {}): ContentSegment[] {
  const text = normalize(input)
  if (!text) return []

  const sentences = sentenceSplit(text)
  const minWords = Math.max(20, options.minWordsPerSegment ?? 35)
  const maxWords = Math.max(minWords + 10, options.maxWordsPerSegment ?? 90)

  const rawSegments: string[] = []
  let bucket: string[] = []
  let bucketWords = 0

  for (const sentence of sentences) {
    const sentenceWords = toWords(sentence).length
    if (bucketWords + sentenceWords > maxWords && bucket.length > 0) {
      rawSegments.push(bucket.join(' '))
      bucket = [sentence]
      bucketWords = sentenceWords
    } else {
      bucket.push(sentence)
      bucketWords += sentenceWords
    }
  }

  if (bucket.length > 0) rawSegments.push(bucket.join(' '))

  const merged: string[] = []
  for (const segment of rawSegments) {
    const words = toWords(segment).length
    if (words < minWords && merged.length > 0) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${segment}`
    } else {
      merged.push(segment)
    }
  }

  const target = Math.max(2, options.targetSegments ?? 3)
  const selected = merged.slice(0, target)

  return selected.map((segment, idx) => {
    const standaloneText = standaloneLead(segment)
    return {
      id: `seg-${idx + 1}`,
      title: titleFrom(standaloneText),
      text: standaloneText,
      wordCount: toWords(standaloneText).length
    }
  })
}
