import { useSyncExternalStore } from 'react'

import {
  answerWhereToChange,
  buildCodebaseIndex,
  type ChangeAnswer,
  type CodebaseIndex,
  type SourceDocument
} from '../../domain'
import { loadNavigatorData, saveNavigatorData } from '../persistence/storage'

const seedDocs: SourceDocument[] = [
  {
    path: 'src/app/router.tsx',
    content: `import { buildCodebaseIndex } from '../domain/indexer'\nexport function setupRouter() { return buildCodebaseIndex([]) }`
  },
  {
    path: 'src/features/search/SearchPanel.tsx',
    content: `import { semanticSearch } from '../../domain/semantic_search'\nexport function SearchPanel() { return semanticSearch as unknown as number }`
  },
  {
    path: 'src/domain/semantic_search.ts',
    content: `export function semanticSearch() { return [] }`
  }
]

export interface NavigatorState {
  docs: SourceDocument[]
  index: CodebaseIndex
  query: string
}

const loaded = loadNavigatorData({ docs: seedDocs, index: null })

let state: NavigatorState = {
  docs: loaded.docs,
  index: loaded.index ?? buildCodebaseIndex(loaded.docs),
  query: 'where to change search ranking'
}

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  saveNavigatorData({ docs: state.docs, index: state.index })
}

export const navigatorActions = {
  setQuery(query: string) {
    state = { ...state, query }
    emit()
  },
  reindex() {
    state = { ...state, index: buildCodebaseIndex(state.docs) }
    persist()
    emit()
  },
  addDocument(path: string, content: string) {
    const docs = [...state.docs, { path, content }]
    state = { ...state, docs, index: buildCodebaseIndex(docs) }
    persist()
    emit()
  },
  resetSeed() {
    state = {
      docs: seedDocs,
      index: buildCodebaseIndex(seedDocs),
      query: 'where to change search ranking'
    }
    persist()
    emit()
  }
}

export function selectDerived(current: NavigatorState): {
  answer: ChangeAnswer
  files: string[]
  edges: Array<{ from: string; to: string; line: number }>
} {
  return {
    answer: answerWhereToChange(current.index, current.query),
    files: current.index.files.map((file) => file.path),
    edges: current.index.graph.edges
  }
}

export function useNavigatorStore<T>(selector: (state: NavigatorState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}
