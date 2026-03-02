import type { TaskRecord } from './tasks'

export interface ScoreSnapshot {
  total: number
  consistency: number
  difficultyBonus: number
  safetyBonus: number
}

export function scoreTasks(tasks: TaskRecord[], notesCount: number, safetyConfirmed: boolean): ScoreSnapshot {
  const completed = tasks.reduce((sum, task) => sum + task.completionCount, 0)
  const consistency = Math.min(50, completed * 4)
  const difficultyBonus = Math.min(35, tasks.reduce((sum, task) => sum + task.difficulty * task.completionCount, 0))
  const safetyBonus = safetyConfirmed ? Math.min(15, notesCount * 2) : 0
  const total = consistency + difficultyBonus + safetyBonus

  return { total, consistency, difficultyBonus, safetyBonus }
}
