import type { ScoreEntry, Student, StudentStandardMastery, MasteryStatus, Standard } from './standards'

export interface MasteryRuleConfig {
  masteryThreshold: number
  developingThreshold: number
  minimumAttemptsForMastery: number
}

export interface StudentProgressSummary {
  studentId: string
  masteredCount: number
  developingCount: number
  notStartedCount: number
  masteryPercent: number
}

export const DEFAULT_MASTERY_RULES: MasteryRuleConfig = {
  masteryThreshold: 85,
  developingThreshold: 60,
  minimumAttemptsForMastery: 2
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateMasteryStatus(
  attempts: number,
  averageScore: number,
  latestScore: number | null,
  config: MasteryRuleConfig = DEFAULT_MASTERY_RULES
): MasteryStatus {
  if (attempts === 0 || latestScore === null) {
    return 'not_started'
  }

  if (attempts >= config.minimumAttemptsForMastery && averageScore >= config.masteryThreshold && latestScore >= config.masteryThreshold) {
    return 'mastered'
  }

  if (latestScore >= config.developingThreshold || averageScore >= config.developingThreshold) {
    return 'developing'
  }

  return 'not_started'
}

export function calculateStudentMasteryByStandard(
  student: Student,
  standards: Standard[],
  scores: ScoreEntry[],
  config: MasteryRuleConfig = DEFAULT_MASTERY_RULES
): StudentStandardMastery[] {
  const studentScores = scores.filter((entry) => entry.studentId === student.id)

  return standards.map((standard) => {
    const attempts = studentScores
      .filter((entry) => entry.standardId === standard.id)
      .sort((a, b) => a.assessedAtIso.localeCompare(b.assessedAtIso))

    const attemptCount = attempts.length
    const total = attempts.reduce((sum, entry) => sum + entry.score, 0)
    const average = attemptCount > 0 ? total / attemptCount : 0
    const latest = attemptCount > 0 ? attempts[attemptCount - 1].score : null

    return {
      standardId: standard.id,
      attempts: attemptCount,
      averageScore: round(average),
      latestScore: latest,
      status: calculateMasteryStatus(attemptCount, average, latest, config)
    }
  })
}

export function calculateStudentProgress(
  student: Student,
  standards: Standard[],
  scores: ScoreEntry[],
  config: MasteryRuleConfig = DEFAULT_MASTERY_RULES
): StudentProgressSummary {
  const mastery = calculateStudentMasteryByStandard(student, standards, scores, config)

  const masteredCount = mastery.filter((item) => item.status === 'mastered').length
  const developingCount = mastery.filter((item) => item.status === 'developing').length
  const notStartedCount = mastery.filter((item) => item.status === 'not_started').length

  return {
    studentId: student.id,
    masteredCount,
    developingCount,
    notStartedCount,
    masteryPercent: Math.round((masteredCount / standards.length) * 100)
  }
}
