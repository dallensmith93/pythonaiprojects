export interface ResumeVersion {
  id: string
  createdAtIso: string
  tailoredBullets: string[]
}

export interface ResumePersistedData {
  resumeText: string
  jdText: string
  versions: ResumeVersion[]
  selectedVersionId: string | null
}

const STORAGE_KEY = 'ats-resume-tailor/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadResumeData(defaultData: ResumePersistedData): ResumePersistedData {
  if (!hasWindow()) return defaultData

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as ResumePersistedData
    return {
      resumeText: parsed.resumeText ?? defaultData.resumeText,
      jdText: parsed.jdText ?? defaultData.jdText,
      versions: Array.isArray(parsed.versions) ? parsed.versions : defaultData.versions,
      selectedVersionId: parsed.selectedVersionId ?? defaultData.selectedVersionId
    }
  } catch {
    return defaultData
  }
}

export function saveResumeData(data: ResumePersistedData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
