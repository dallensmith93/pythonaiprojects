export type MasteryStatus = 'not_started' | 'developing' | 'mastered'

export interface Standard {
  id: string
  code: string
  title: string
  strand: string
  prerequisiteIds: string[]
}

export interface Student {
  id: string
  name: string
  gradeLevel: string
}

export interface ScoreEntry {
  studentId: string
  standardId: string
  score: number
  assessedAtIso: string
}

export interface StudentStandardMastery {
  standardId: string
  attempts: number
  averageScore: number
  latestScore: number | null
  status: MasteryStatus
}

export const STANDARDS: Standard[] = [
  { id: 's-num-1', code: 'N.1', title: 'Multiply integers fluently', strand: 'Number', prerequisiteIds: [] },
  { id: 's-num-2', code: 'N.2', title: 'Operate with rational numbers', strand: 'Number', prerequisiteIds: ['s-num-1'] },
  { id: 's-eq-1', code: 'E.1', title: 'Solve one-step equations', strand: 'Expressions', prerequisiteIds: ['s-num-1'] },
  { id: 's-eq-2', code: 'E.2', title: 'Solve multi-step equations', strand: 'Expressions', prerequisiteIds: ['s-eq-1', 's-num-2'] },
  { id: 's-fn-1', code: 'F.1', title: 'Interpret function notation', strand: 'Functions', prerequisiteIds: ['s-eq-2'] }
]

export const STUDENTS: Student[] = [
  { id: 'stu-ava', name: 'Ava Carter', gradeLevel: '7' },
  { id: 'stu-noah', name: 'Noah Kim', gradeLevel: '7' },
  { id: 'stu-mia', name: 'Mia Patel', gradeLevel: '8' }
]
