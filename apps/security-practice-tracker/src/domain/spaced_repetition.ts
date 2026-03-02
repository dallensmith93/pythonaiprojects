import type { TaskRecord } from './tasks'

export interface DueReview {
  taskId: string
  daysSince: number
}

export function reviewIntervalDays(difficulty: 1 | 2 | 3, completionCount: number): number {
  const base = difficulty === 1 ? 2 : difficulty === 2 ? 1 : 1
  return Math.min(7, base + Math.floor(completionCount / 2))
}

export function dueReviews(tasks: TaskRecord[], todayDay: number): DueReview[] {
  return tasks
    .filter((task) => task.lastCompletedDay !== null)
    .map((task) => {
      const daysSince = todayDay - (task.lastCompletedDay ?? todayDay)
      return { taskId: task.id, daysSince }
    })
    .filter((review) => {
      const task = tasks.find((item) => item.id === review.taskId)
      if (!task) return false
      return review.daysSince >= reviewIntervalDays(task.difficulty, task.completionCount)
    })
    .sort((a, b) => b.daysSince - a.daysSince)
}
