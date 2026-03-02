import { useSyncExternalStore } from 'react'

import {
  buildDiff,
  computeKeywordCoverage,
  extractKeywordsFromResume,
  generateRewriteSuggestions,
  parseJd,
  parseResume
} from '../../domain'
import { loadResumeData, saveResumeData, type ResumeVersion } from '../persistence/storage'

export interface TailorState {
  resumeText: string
  jdText: string
  versions: ResumeVersion[]
  selectedVersionId: string | null
}

const defaultResume = `- Built internal dashboard for support teams\n- Improved API latency in production\n- Collaborated with product and design`
const defaultJd = `Seeking software engineer with API optimization, stakeholder collaboration, observability, TypeScript, and testing experience.`

let state: TailorState = loadResumeData({
  resumeText: defaultResume,
  jdText: defaultJd,
  versions: [],
  selectedVersionId: null
})

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  saveResumeData(state)
}

export const tailorActions = {
  setResumeText(resumeText: string) {
    state = { ...state, resumeText }
    persist()
    emit()
  },
  setJdText(jdText: string) {
    state = { ...state, jdText }
    persist()
    emit()
  },
  createVersion(tailoredBullets: string[]) {
    const version: ResumeVersion = {
      id: `v-${Date.now()}`,
      createdAtIso: new Date().toISOString(),
      tailoredBullets
    }

    state = {
      ...state,
      versions: [version, ...state.versions],
      selectedVersionId: version.id
    }
    persist()
    emit()
  },
  selectVersion(id: string) {
    state = { ...state, selectedVersionId: id }
    persist()
    emit()
  },
  reset() {
    state = {
      resumeText: defaultResume,
      jdText: defaultJd,
      versions: [],
      selectedVersionId: null
    }
    persist()
    emit()
  }
}

export function selectDerived(current: TailorState) {
  const parsedResume = parseResume(current.resumeText)
  const parsedJd = parseJd(current.jdText)
  const resumeKeywords = extractKeywordsFromResume(parsedResume)
  const coverage = computeKeywordCoverage(parsedJd.keywords, resumeKeywords)

  const suggestions = generateRewriteSuggestions(parsedResume.bullets, parsedJd.keywords)

  const selectedVersion =
    current.selectedVersionId === null ? null : current.versions.find((version) => version.id === current.selectedVersionId) ?? null

  const diffs = suggestions.map((suggestion) => buildDiff(suggestion.original, suggestion.rewritten))

  return {
    parsedResume,
    parsedJd,
    coverage,
    suggestions,
    selectedVersion,
    diffs
  }
}

export function useTailorStore<T>(selector: (state: TailorState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}
