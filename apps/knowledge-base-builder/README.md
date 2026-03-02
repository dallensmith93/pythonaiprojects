# Knowledge Base Builder

Turn raw docs into a searchable local knowledge base with citation-backed results.

## Workflow
1. Paste docs in the ingestion panel (`---` separates docs).
2. Run ingest/index.
3. Search indexed chunks.
4. Open doc viewer context.
5. Review contradiction warnings.

## Core Logic
- `ingestion`: parses raw multi-doc input into structured docs.
- `chunking`: creates fixed-size chunks with citations (`DocTitle#chunk-N`).
- `dedupe`: removes normalized duplicate chunks.
- `kb_ui`: query scoring and ranked retrieval.
- `contradiction_check`: lightweight keyword conflict detection.

## Citation Requirement
Every search result includes:
- document title
- chunk id
- citation string in `DocTitle#chunk-N` format

## Storage
Docs and chunk index are stored in browser `localStorage`.

## Scripts
- `pnpm --filter @apps/knowledge-base-builder dev`
- `pnpm --filter @apps/knowledge-base-builder build`
- `pnpm --filter @apps/knowledge-base-builder lint`
- `pnpm --filter @apps/knowledge-base-builder typecheck`
- `pnpm --filter @apps/knowledge-base-builder test`
- `pnpm --filter @apps/knowledge-base-builder test:coverage`
- `pnpm --filter @apps/knowledge-base-builder e2e`
