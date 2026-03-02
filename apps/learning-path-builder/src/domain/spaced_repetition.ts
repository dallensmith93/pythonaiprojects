import type { ProgressRecord } from './progress'

export interface ReviewItem {
  skillId: string
  dueDay: number
  intervalDays: number
}

export function nextReviewIntervalDays(mastery: number): number {
  if (mastery >= 90) return 7
  if (mastery >= 75) return 4
  if (mastery >= 60) return 2
  return 1
}

export function buildReviewQueue(records: ProgressRecord[], todayDay: number): ReviewItem[] {
  return records
    .map((record) => {
      const interval = nextReviewIntervalDays(record.mastery)
      return {
        skillId: record.skillId,
        dueDay: record.lastReviewedDay + interval,
        intervalDays: interval
      }
    })
    .filter((item) => item.dueDay <= todayDay)
    .sort((a, b) => a.dueDay - b.dueDay)
}
