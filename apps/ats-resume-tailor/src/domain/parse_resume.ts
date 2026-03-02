export interface ResumeBullet {
  id: string
  text: string
}

export interface ParsedResume {
  bullets: ResumeBullet[]
  normalizedText: string
}

export function parseResume(text: string): ParsedResume {
  const bullets = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `b-${index + 1}`,
      text: line.replace(/^[-*]\s*/, '')
    }))

  return {
    bullets,
    normalizedText: text.toLowerCase()
  }
}
