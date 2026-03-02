import type { ScoreEntry, Standard, Student } from './standards'
import { calculateStudentMasteryByStandard } from './mastery_rules'
import { getUnlockableStandards } from './prereq_graph'

export function suggestNextStandards(student: Student, standards: Standard[], scores: ScoreEntry[]): Standard[] {
  const mastery = calculateStudentMasteryByStandard(student, standards, scores)
  const masteryMap = Object.fromEntries(mastery.map((item) => [item.standardId, item.status]))
  return getUnlockableStandards(standards, masteryMap)
}
