import { useSyncExternalStore } from 'react'

import {
  SEED_TICKETS,
  estimateBacklog,
  estimateTicket,
  planSprints,
  topologicalOrder,
  validateDependencyGraph,
  type Ticket,
  type TicketStatus
} from '../../domain'
import { loadSprintData, saveSprintData } from '../persistence/storage'

export interface SprintPlannerState {
  tickets: Ticket[]
  sprintCapacityPoints: number
}

let state: SprintPlannerState = loadSprintData({
  tickets: SEED_TICKETS,
  sprintCapacityPoints: 16
})

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  saveSprintData({ tickets: state.tickets, sprintCapacityPoints: state.sprintCapacityPoints })
}

export const sprintActions = {
  addTicket(ticket: Ticket) {
    state = { ...state, tickets: [...state.tickets, ticket] }
    persist()
    emit()
  },
  updateTicket(id: string, patch: Partial<Ticket>) {
    state = {
      ...state,
      tickets: state.tickets.map((ticket) => (ticket.id === id ? { ...ticket, ...patch } : ticket))
    }
    persist()
    emit()
  },
  setTicketStatus(id: string, status: TicketStatus) {
    sprintActions.updateTicket(id, { status })
  },
  setSprintCapacity(points: number) {
    state = { ...state, sprintCapacityPoints: points }
    persist()
    emit()
  },
  resetDefaults() {
    state = { tickets: SEED_TICKETS, sprintCapacityPoints: 16 }
    persist()
    emit()
  }
}

export function selectDerived(current: SprintPlannerState) {
  const validation = validateDependencyGraph(current.tickets)
  const ordered = validation.valid ? topologicalOrder(current.tickets) : []
  const plans = validation.valid ? planSprints(current.tickets, current.sprintCapacityPoints) : []
  const backlogPoints = estimateBacklog(current.tickets)

  return {
    validation,
    ordered,
    plans,
    backlogPoints,
    estimateById: Object.fromEntries(current.tickets.map((ticket) => [ticket.id, estimateTicket(ticket)]))
  }
}

export function useSprintStore<T>(selector: (state: SprintPlannerState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}
