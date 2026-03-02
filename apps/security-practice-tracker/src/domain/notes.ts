export interface PracticeNote {
  id: string
  taskId: string
  text: string
  createdAt: number
  safetyAcknowledged: boolean
}

export function createNote(taskId: string, text: string): PracticeNote {
  return {
    id: `note-${Date.now()}`,
    taskId,
    text: text.trim(),
    createdAt: Date.now(),
    safetyAcknowledged: true
  }
}
