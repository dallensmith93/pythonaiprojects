import type { MasteryStatus, Standard, Student } from './standards'
import { calculateStudentMasteryByStandard } from './mastery_rules'

export interface HeatmapCell {
  studentId: string
  studentName: string
  standardId: string
  standardCode: string
  status: MasteryStatus
}

export function buildHeatmap(students: Student[], standards: Standard[], scores: Parameters<typeof calculateStudentMasteryByStandard>[2]): HeatmapCell[] {
  const cells: HeatmapCell[] = []

  for (const student of students) {
    const mastery = calculateStudentMasteryByStandard(student, standards, scores)
    const map = Object.fromEntries(mastery.map((row) => [row.standardId, row.status]))
    for (const standard of standards) {
      cells.push({
        studentId: student.id,
        studentName: student.name,
        standardId: standard.id,
        standardCode: standard.code,
        status: map[standard.id] ?? 'not_started'
      })
    }
  }

  return cells
}
