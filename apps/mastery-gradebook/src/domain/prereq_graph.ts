import type { MasteryStatus, Standard } from './standards'

export interface PrerequisiteGraph {
  adjacency: Record<string, string[]>
}

export function buildPrerequisiteGraph(standards: Standard[]): PrerequisiteGraph {
  const adjacency: Record<string, string[]> = {}
  for (const standard of standards) {
    adjacency[standard.id] = [...standard.prerequisiteIds]
  }
  return { adjacency }
}

export function detectPrerequisiteCycle(graph: PrerequisiteGraph): boolean {
  const visiting = new Set<string>()
  const visited = new Set<string>()

  function dfs(node: string): boolean {
    if (visiting.has(node)) return true
    if (visited.has(node)) return false

    visiting.add(node)
    for (const prereq of graph.adjacency[node] ?? []) {
      if (dfs(prereq)) return true
    }
    visiting.delete(node)
    visited.add(node)
    return false
  }

  return Object.keys(graph.adjacency).some((node) => dfs(node))
}

export function getUnlockableStandards(
  standards: Standard[],
  masteredStatusByStandardId: Record<string, MasteryStatus>
): Standard[] {
  return standards.filter((standard) => {
    const currentStatus = masteredStatusByStandardId[standard.id] ?? 'not_started'
    if (currentStatus === 'mastered') {
      return false
    }

    return standard.prerequisiteIds.every((prereqId) => masteredStatusByStandardId[prereqId] === 'mastered')
  })
}
