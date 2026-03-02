import type { ParsedGoal } from './goal_parser'
import { orderedByPrerequisites, type SkillNode } from './prerequisites'
import { recommendedDailyMinutes, summarizeProgress, type ProgressRecord } from './progress'
import { buildReviewQueue } from './spaced_repetition'

export interface PlannedTask {
  day: string
  skillId: string
  type: 'learn' | 'review'
  minutes: number
  note: string
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const DAY_MS = 86_400_000

export function buildWeeklyPlan(
  goal: ParsedGoal,
  skills: SkillNode[],
  records: ProgressRecord[]
): PlannedTask[] {
  const ordered = orderedByPrerequisites(skills)
  const progress = summarizeProgress(skills, records)
  const completed = new Set(progress.completed)
  const dailyMinutes = recommendedDailyMinutes(goal)
  const todayDay = Math.floor(Date.now() / DAY_MS)
  const reviews = buildReviewQueue(records, todayDay)

  const tasks: PlannedTask[] = []
  let learnIdx = 0

  for (let i = 0; i < goal.sessionsPerWeek; i += 1) {
    const day = DAYS[i % DAYS.length]

    const review = reviews[i]
    if (review) {
      tasks.push({
        day,
        skillId: review.skillId,
        type: 'review',
        minutes: Math.round(dailyMinutes * 0.45),
        note: `Spaced repetition review (interval ${review.intervalDays}d).`
      })
    }

    while (learnIdx < ordered.length && completed.has(ordered[learnIdx].id)) {
      learnIdx += 1
    }

    if (learnIdx < ordered.length) {
      const skill = ordered[learnIdx]
      tasks.push({
        day,
        skillId: skill.id,
        type: 'learn',
        minutes: Math.round(dailyMinutes * (review ? 0.55 : 1)),
        note: `Progress ${skill.title} with prerequisite-aware pacing.`
      })
      if (!review) learnIdx += 1
    }
  }

  return tasks
}
