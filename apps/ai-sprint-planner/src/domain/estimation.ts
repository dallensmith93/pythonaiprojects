import type { Ticket } from './ticketing'

export function estimateStoryPoints(complexity: Ticket['complexity'], uncertainty: Ticket['uncertainty']): number {
  return complexity * 2 + uncertainty
}

export function estimateTicket(ticket: Ticket): number {
  return estimateStoryPoints(ticket.complexity, ticket.uncertainty)
}

export function estimateBacklog(tickets: Ticket[]): number {
  return tickets.reduce((sum, ticket) => sum + estimateTicket(ticket), 0)
}
