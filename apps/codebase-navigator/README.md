# Codebase Navigator Agent

ID: 07
Slug: codebase-navigator

Index a codebase, map dependencies, and answer ?where should I change X?? with file references.

## Usage
- Add source documents to the index (path + content).
- Reindex to rebuild AST-like parse metadata, dependency graph, symbol refs, and local embeddings.
- Enter a query and review ranked file references with line hints.

## What the index stores
- Parsed imports/exports and tokenized content per file.
- Internal dependency edges (`from -> to @ line`).
- Symbol references for citation-like answers.
- Lightweight local token embeddings for search ranking.

## Accuracy notes
- Parsing is lightweight (regex-based), so results are strongest for standard TS/TSX syntax.
- File references include path + line from export/import parse points.

## Commands
- `pnpm --filter @apps/codebase-navigator dev`
- `pnpm --filter @apps/codebase-navigator build`
- `pnpm --filter @apps/codebase-navigator lint`
- `pnpm --filter @apps/codebase-navigator typecheck`
- `pnpm --filter @apps/codebase-navigator test`
- `pnpm --filter @apps/codebase-navigator test:coverage`
- `pnpm --filter @apps/codebase-navigator e2e`
