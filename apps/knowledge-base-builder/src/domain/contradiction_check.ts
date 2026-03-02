import type { DocChunk } from './chunking'

export interface ContradictionWarning {
  leftCitation: string
  rightCitation: string
  reason: string
}

export function detectSimpleContradictions(chunks: DocChunk[]): ContradictionWarning[] {
  const warnings: ContradictionWarning[] = []

  for (let i = 0; i < chunks.length; i += 1) {
    for (let j = i + 1; j < chunks.length; j += 1) {
      const a = chunks[i].text.toLowerCase()
      const b = chunks[j].text.toLowerCase()
      const maybeConflict = (a.includes('always') && b.includes('never')) || (a.includes('required') && b.includes('optional'))
      if (maybeConflict) {
        warnings.push({
          leftCitation: chunks[i].citation,
          rightCitation: chunks[j].citation,
          reason: 'Potential policy contradiction keywords detected.'
        })
      }
    }
  }

  return warnings.slice(0, 8)
}
