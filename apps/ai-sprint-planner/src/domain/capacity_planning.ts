import { estimateTicket } from './estimation'
import { topologicalOrder, validateDependencyGraph } from './dependency_graph'
import type { Ticket } from './ticketing'

export interface SprintPlan {
  sprintId: string
  ticketIds: string[]
  totalPoints: number
}

export function planSprints(tickets: Ticket[], sprintCapacityPoints: number): SprintPlan[] {
  const validation = validateDependencyGraph(tickets)
  if (!validation.valid) {
    return []
  }

  const byId = new Map(tickets.map((ticket) => [ticket.id, ticket]))
  const ordered = topologicalOrder(tickets)
  const plans: SprintPlan[] = []

  let sprintIndex = 1
  let current: SprintPlan = {
    sprintId: `S${sprintIndex}`,
    ticketIds: [],
    totalPoints: 0
  }

  for (const id of ordered) {
    const ticket = byId.get(id)
    if (!ticket) continue
    const points = estimateTicket(ticket)

    if (current.totalPoints + points > sprintCapacityPoints && current.ticketIds.length > 0) {
      plans.push(current)
      sprintIndex += 1
      current = {
        sprintId: `S${sprintIndex}`,
        ticketIds: [],
        totalPoints: 0
      }
    }

    current.ticketIds.push(ticket.id)
    current.totalPoints += points
  }

  if (current.ticketIds.length > 0) {
    plans.push(current)
  }

  return plans
}
