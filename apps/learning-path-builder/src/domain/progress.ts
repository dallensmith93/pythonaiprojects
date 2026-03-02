import type { ParsedGoal } from './goal_parser'
import type { SkillNode } from './prerequisites'

export interface ProgressRecord {
  skillId: string
  mastery: number
  lastReviewedDay: number
}

export interface ProgressSnapshot {
  completed: string[]
  inProgress: string[]
  avgMastery: number
}

export function summarizeProgress(skills: SkillNode[], records: ProgressRecord[]): ProgressSnapshot {
  const bySkill = new Map(records.map((record) => [record.skillId, record]))

  const completed: string[] = []
  const inProgress: string[] = []

  for (const skill of skills) {
    const score = bySkill.get(skill.id)?.mastery ?? 0
    if (score >= 85) completed.push(skill.id)
    else if (score > 0) inProgress.push(skill.id)
  }

  const avgMastery = records.length === 0
    ? 0
    : Math.round(records.reduce((sum, record) => sum + record.mastery, 0) / records.length)

  return { completed, inProgress, avgMastery }
}

export function recommendedDailyMinutes(goal: ParsedGoal): number {
  const base = 45
  const scale = Math.max(0, (7 - goal.targetWeeks) * 5)
  return Math.min(90, base + scale)
}
