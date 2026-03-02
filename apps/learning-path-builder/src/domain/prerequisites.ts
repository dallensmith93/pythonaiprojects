export interface SkillNode {
  id: string
  title: string
  prerequisites: string[]
  estimatedHours: number
}

export const DEFAULT_SKILLS: SkillNode[] = [
  { id: 'fundamentals', title: 'Fundamentals', prerequisites: [], estimatedHours: 6 },
  { id: 'core-practice', title: 'Core Practice', prerequisites: ['fundamentals'], estimatedHours: 8 },
  { id: 'applied-project', title: 'Applied Project', prerequisites: ['core-practice'], estimatedHours: 10 },
  { id: 'review-polish', title: 'Review and Polish', prerequisites: ['applied-project'], estimatedHours: 4 }
]

export function isUnlocked(skill: SkillNode, completedIds: Set<string>): boolean {
  return skill.prerequisites.every((id) => completedIds.has(id))
}

export function orderedByPrerequisites(skills: SkillNode[]): SkillNode[] {
  const byId = new Map(skills.map((skill) => [skill.id, skill]))
  const inDegree = new Map<string, number>()
  const edges = new Map<string, string[]>()

  for (const skill of skills) {
    inDegree.set(skill.id, 0)
    edges.set(skill.id, [])
  }

  for (const skill of skills) {
    for (const prereq of skill.prerequisites) {
      if (!byId.has(prereq)) continue
      inDegree.set(skill.id, (inDegree.get(skill.id) ?? 0) + 1)
      edges.set(prereq, [...(edges.get(prereq) ?? []), skill.id])
    }
  }

  const queue = skills.filter((skill) => (inDegree.get(skill.id) ?? 0) === 0).map((skill) => skill.id)
  const ordered: SkillNode[] = []

  while (queue.length > 0) {
    const id = queue.shift()!
    const skill = byId.get(id)
    if (skill) ordered.push(skill)

    for (const next of edges.get(id) ?? []) {
      const degree = (inDegree.get(next) ?? 0) - 1
      inDegree.set(next, degree)
      if (degree === 0) queue.push(next)
    }
  }

  return ordered
}
