import type { Ticket } from './ticketing'

export interface GraphValidation {
  missingDependencies: Array<{ ticketId: string; missingDependencyId: string }>
  cycle: string[] | null
  valid: boolean
}

export function detectDependencyCycle(tickets: Ticket[]): string[] | null {
  const byId = new Map(tickets.map((ticket) => [ticket.id, ticket]))
  const visiting = new Set<string>()
  const visited = new Set<string>()

  function dfs(id: string, path: string[]): string[] | null {
    if (visiting.has(id)) {
      const idx = path.indexOf(id)
      return idx >= 0 ? [...path.slice(idx), id] : [id]
    }
    if (visited.has(id)) return null

    visiting.add(id)
    const ticket = byId.get(id)
    if (ticket) {
      for (const dep of ticket.dependencies) {
        if (!byId.has(dep)) continue
        const result = dfs(dep, [...path, id])
        if (result) return result
      }
    }
    visiting.delete(id)
    visited.add(id)
    return null
  }

  for (const ticket of tickets) {
    const cycle = dfs(ticket.id, [])
    if (cycle) return cycle
  }

  return null
}

export function validateDependencyGraph(tickets: Ticket[]): GraphValidation {
  const ids = new Set(tickets.map((ticket) => ticket.id))
  const missingDependencies: Array<{ ticketId: string; missingDependencyId: string }> = []

  for (const ticket of tickets) {
    for (const dependency of ticket.dependencies) {
      if (!ids.has(dependency)) {
        missingDependencies.push({ ticketId: ticket.id, missingDependencyId: dependency })
      }
    }
  }

  const cycle = detectDependencyCycle(tickets)

  return {
    missingDependencies,
    cycle,
    valid: missingDependencies.length === 0 && cycle === null
  }
}

export function topologicalOrder(tickets: Ticket[]): string[] {
  const byId = new Map(tickets.map((ticket) => [ticket.id, ticket]))
  const inDegree = new Map<string, number>()
  const outEdges = new Map<string, string[]>()

  for (const ticket of tickets) {
    inDegree.set(ticket.id, 0)
    outEdges.set(ticket.id, [])
  }

  for (const ticket of tickets) {
    for (const dep of ticket.dependencies) {
      if (!byId.has(dep)) continue
      outEdges.set(dep, [...(outEdges.get(dep) ?? []), ticket.id])
      inDegree.set(ticket.id, (inDegree.get(ticket.id) ?? 0) + 1)
    }
  }

  const queue = [...tickets.filter((ticket) => (inDegree.get(ticket.id) ?? 0) === 0).map((ticket) => ticket.id)]
  const ordered: string[] = []

  while (queue.length > 0) {
    const current = queue.shift()!
    ordered.push(current)

    for (const neighbor of outEdges.get(current) ?? []) {
      const nextDegree = (inDegree.get(neighbor) ?? 0) - 1
      inDegree.set(neighbor, nextDegree)
      if (nextDegree === 0) queue.push(neighbor)
    }
  }

  return ordered
}

export function isDependencySatisfied(ticket: Ticket, doneIds: Set<string>): boolean {
  return ticket.dependencies.every((dependency) => doneIds.has(dependency))
}
