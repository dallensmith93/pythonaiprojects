export interface ChecklistItem {
  id: string
  text: string
  estimatedMinutes: number
  difficulty: 1 | 2 | 3
}

function normalizeLine(line: string): string {
  return line.replace(/^[-*\d.\s\[\]xX]+/, '').trim()
}

function parseMinutes(line: string): number {
  const match = line.match(/(\d{1,3})\s*(m|min|minutes)/i)
  if (match) return Math.max(5, Math.min(120, Number(match[1])))
  return 20
}

function parseDifficulty(line: string): 1 | 2 | 3 {
  const lower = line.toLowerCase()
  if (lower.includes('boss') || lower.includes('hard') || lower.includes('expert')) return 3
  if (lower.includes('easy') || lower.includes('intro')) return 1
  return 2
}

export function parseChecklistInput(input: string): ChecklistItem[] {
  return input
    .split(/\r?\n/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((line, index) => {
      const cleaned = normalizeLine(line)
      return {
        id: `item-${index + 1}`,
        text: cleaned,
        estimatedMinutes: parseMinutes(line),
        difficulty: parseDifficulty(line)
      }
    })
}
