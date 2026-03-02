import { describe, expect, it } from 'vitest'

import { buildCodebaseIndex, parseSourceFile, semanticSearch } from '../domain'

describe('parsing and indexing', () => {
  it('parses imports/exports with line refs', () => {
    const parsed = parseSourceFile(
      'src/a.ts',
      "import { b } from './b'\nexport function run() { return b }"
    )

    expect(parsed.imports[0].source).toBe('./b')
    expect(parsed.exports[0].symbol).toBe('run')
    expect(parsed.exports[0].line).toBe(2)
  })

  it('builds dependency edges and search hits', () => {
    const index = buildCodebaseIndex([
      { path: 'src/a.ts', content: "import { b } from './b'\nexport function alpha() {}" },
      { path: 'src/b.ts', content: 'export const b = 1' }
    ])

    expect(index.graph.edges.length).toBe(1)
    const hits = semanticSearch(index, 'alpha')
    expect(hits[0].path).toBe('src/a.ts')
  })
})
