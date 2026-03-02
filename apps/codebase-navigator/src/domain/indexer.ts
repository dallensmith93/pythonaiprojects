import { parseSourceFile, type ParsedFile } from './ast_parser'
import { buildDependencyGraph, type DependencyGraph } from './dependency_map'

export interface SourceDocument {
  path: string
  content: string
}

export interface SymbolRef {
  symbol: string
  path: string
  line: number
}

export interface CodebaseIndex {
  files: ParsedFile[]
  graph: DependencyGraph
  symbols: SymbolRef[]
  embeddings: Record<string, Record<string, number>>
}

function toEmbedding(tokens: string[]): Record<string, number> {
  const vector: Record<string, number> = {}
  for (const token of tokens) {
    vector[token] = (vector[token] ?? 0) + 1
  }
  return vector
}

export function buildCodebaseIndex(documents: SourceDocument[]): CodebaseIndex {
  const files = documents.map((doc) => parseSourceFile(doc.path, doc.content))
  const graph = buildDependencyGraph(files)

  const symbols: SymbolRef[] = files.flatMap((file) =>
    file.exports.map((entry) => ({
      symbol: entry.symbol,
      path: file.path,
      line: entry.line
    }))
  )

  const embeddings: Record<string, Record<string, number>> = {}
  for (const file of files) {
    embeddings[file.path] = toEmbedding(file.tokens)
  }

  return {
    files,
    graph,
    symbols,
    embeddings
  }
}
