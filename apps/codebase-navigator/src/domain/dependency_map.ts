import type { ParsedFile } from './ast_parser'

export interface DependencyEdge {
  from: string
  to: string
  line: number
}

export interface DependencyGraph {
  nodes: string[]
  edges: DependencyEdge[]
}

function normalizeImport(fromPath: string, source: string): string {
  if (!source.startsWith('.')) {
    return source
  }

  const parts = fromPath.split('/')
  parts.pop()
  const sourceParts = source.split('/')

  for (const part of sourceParts) {
    if (part === '.' || part === '') continue
    if (part === '..') {
      parts.pop()
    } else {
      parts.push(part)
    }
  }

  let normalized = parts.join('/')
  if (!normalized.endsWith('.ts') && !normalized.endsWith('.tsx')) {
    normalized = `${normalized}.ts`
  }
  return normalized
}

export function buildDependencyGraph(files: ParsedFile[]): DependencyGraph {
  const nodes = files.map((file) => file.path)
  const known = new Set(nodes)
  const edges: DependencyEdge[] = []

  for (const file of files) {
    for (const imp of file.imports) {
      const target = normalizeImport(file.path, imp.source)
      if (known.has(target)) {
        edges.push({ from: file.path, to: target, line: imp.line })
      }
    }
  }

  return { nodes, edges }
}
