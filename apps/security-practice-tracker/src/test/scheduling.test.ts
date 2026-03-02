import { describe, expect, it } from 'vitest'

import { dueReviews, reviewIntervalDays } from '../domain/spaced_repetition'
import type { TaskRecord } from '../domain/tasks'

describe('scheduling logic', () => {
  it('increases review interval with repetitions', () => {
    expect(reviewIntervalDays(1, 0)).toBe(2)
    expect(reviewIntervalDays(1, 4)).toBeGreaterThan(reviewIntervalDays(1, 0))
  })

  it('returns due tasks based on days since completion', () => {
    const today = 100
    const tasks: TaskRecord[] = [
      { id: 'a', title: 'A', targetId: 't1', difficulty: 2, estimatedMinutes: 20, lastCompletedDay: 97, completionCount: 1 },
      { id: 'b', title: 'B', targetId: 't2', difficulty: 1, estimatedMinutes: 20, lastCompletedDay: 99, completionCount: 0 }
    ]

    const due = dueReviews(tasks, today)
    expect(due.some((item) => item.taskId === 'a')).toBe(true)
    expect(due.some((item) => item.taskId === 'b')).toBe(false)
  })
})
