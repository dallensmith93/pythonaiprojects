export interface SourceDoc {
  id: string
  title: string
  content: string
}

export function parseDocsInput(raw: string): SourceDoc[] {
  const blocks = raw
    .split(/^---$/m)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block, idx) => {
    const lines = block.split(/\r?\n/)
    const first = lines[0] ?? `Doc ${idx + 1}`
    const title = first.replace(/^#\s*/, '').trim() || `Doc ${idx + 1}`
    const content = lines.slice(1).join(' ').trim() || first
    return { id: `doc-${idx + 1}`, title, content }
  })
}
