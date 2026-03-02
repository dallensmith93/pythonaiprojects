const STOP_WORDS = new Set([
  'the', 'and', 'with', 'that', 'this', 'from', 'your', 'have', 'will', 'into', 'about', 'for', 'are', 'you'
])

export function suggestHashtags(text: string, maxTags = 5): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word))

  const counts = new Map<string, number>()
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1)

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags)
    .map(([word]) => `#${word}`)
}
