import { describe, expect, it } from 'vitest'

import {
  STANDARDS,
  STUDENTS,
  calculateMasteryStatus,
  calculateStudentMasteryByStandard,
  calculateStudentProgress,
  type ScoreEntry
} from '../domain'

describe('mastery rules', () => {
  it('returns mastered only with sufficient attempts and high scores', () => {
    expect(calculateMasteryStatus(2, 87, 90)).toBe('mastered')
    expect(calculateMasteryStatus(1, 95, 95)).toBe('developing')
  })

  it('builds per-standard mastery rows', () => {
    const scores: ScoreEntry[] = [
      { studentId: STUDENTS[0].id, standardId: STANDARDS[0].id, score: 80, assessedAtIso: '2026-01-01T00:00:00.000Z' },
      { studentId: STUDENTS[0].id, standardId: STANDARDS[0].id, score: 90, assessedAtIso: '2026-01-02T00:00:00.000Z' }
    ]

    const mastery = calculateStudentMasteryByStandard(STUDENTS[0], STANDARDS, scores)
    const first = mastery.find((row) => row.standardId === STANDARDS[0].id)

    expect(first?.attempts).toBe(2)
    expect(first?.status).toBe('mastered')
  })

  it('computes student progress summary', () => {
    const scores: ScoreEntry[] = [
      { studentId: STUDENTS[1].id, standardId: STANDARDS[0].id, score: 88, assessedAtIso: '2026-01-01T00:00:00.000Z' },
      { studentId: STUDENTS[1].id, standardId: STANDARDS[0].id, score: 90, assessedAtIso: '2026-01-02T00:00:00.000Z' },
      { studentId: STUDENTS[1].id, standardId: STANDARDS[1].id, score: 65, assessedAtIso: '2026-01-03T00:00:00.000Z' }
    ]

    const progress = calculateStudentProgress(STUDENTS[1], STANDARDS, scores)
    expect(progress.masteredCount).toBeGreaterThanOrEqual(1)
    expect(progress.developingCount).toBeGreaterThanOrEqual(1)
  })
})
