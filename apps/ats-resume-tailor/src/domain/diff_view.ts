export interface DiffLine {
  type: 'same' | 'added' | 'removed'
  value: string
}

export function buildDiff(original: string, rewritten: string): DiffLine[] {
  if (original === rewritten) {
    return [{ type: 'same', value: original }]
  }

  return [
    { type: 'removed', value: original },
    { type: 'added', value: rewritten }
  ]
}
