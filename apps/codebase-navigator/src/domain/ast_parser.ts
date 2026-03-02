export interface ParsedImport {
  source: string
  symbols: string[]
  line: number
}

export interface ParsedExport {
  symbol: string
  kind: 'function' | 'const' | 'type' | 'interface' | 'class' | 'reexport'
  line: number
}

export interface ParsedFile {
  path: string
  imports: ParsedImport[]
  exports: ParsedExport[]
  tokens: string[]
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_./-\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2)
}

export function parseSourceFile(path: string, content: string): ParsedFile {
  const lines = content.split(/\r?\n/)
  const imports: ParsedImport[] = []
  const exports: ParsedExport[] = []

  lines.forEach((lineText, idx) => {
    const line = idx + 1

    const importMatch = lineText.match(/^\s*import\s+(.+)\s+from\s+['"]([^'"]+)['"]/)
    if (importMatch) {
      const symbolsRaw = importMatch[1]
      const symbols = symbolsRaw
        .replace(/[{}]/g, ' ')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      imports.push({ source: importMatch[2], symbols, line })
    }

    const exportMatch = lineText.match(/^\s*export\s+(function|const|type|interface|class)\s+([A-Za-z0-9_]+)/)
    if (exportMatch) {
      exports.push({ symbol: exportMatch[2], kind: exportMatch[1] as ParsedExport['kind'], line })
    }

    const reexportMatch = lineText.match(/^\s*export\s+\*\s+from\s+['"]([^'"]+)['"]/)
    if (reexportMatch) {
      exports.push({ symbol: reexportMatch[1], kind: 'reexport', line })
    }
  })

  return {
    path,
    imports,
    exports,
    tokens: tokenize(content)
  }
}
