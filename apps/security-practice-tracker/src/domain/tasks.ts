export interface TaskRecord {
  id: string
  title: string
  targetId: string
  difficulty: 1 | 2 | 3
  estimatedMinutes: number
  lastCompletedDay: number | null
  completionCount: number
}

export function buildDailyTasks(baseTasks: TaskRecord[], todayDay: number): TaskRecord[] {
  return baseTasks
    .filter((task) => task.lastCompletedDay === null || todayDay - task.lastCompletedDay >= 1)
    .sort((a, b) => b.difficulty - a.difficulty || a.estimatedMinutes - b.estimatedMinutes)
    .slice(0, 5)
}

export function markTaskComplete(task: TaskRecord, todayDay: number): TaskRecord {
  return {
    ...task,
    lastCompletedDay: todayDay,
    completionCount: task.completionCount + 1
  }
}
