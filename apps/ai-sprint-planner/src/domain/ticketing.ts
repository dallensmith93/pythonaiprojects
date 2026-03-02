export type TicketStatus = 'backlog' | 'in_sprint' | 'done'

export interface Ticket {
  id: string
  title: string
  feature: string
  complexity: 1 | 2 | 3 | 4 | 5
  uncertainty: 1 | 2 | 3
  dependencies: string[]
  status: TicketStatus
  sprintId?: string
}

export const SEED_TICKETS: Ticket[] = [
  {
    id: 'T-101',
    title: 'Auth service skeleton',
    feature: 'Authentication',
    complexity: 3,
    uncertainty: 2,
    dependencies: [],
    status: 'backlog'
  },
  {
    id: 'T-102',
    title: 'Login page form',
    feature: 'Authentication',
    complexity: 2,
    uncertainty: 1,
    dependencies: ['T-101'],
    status: 'backlog'
  },
  {
    id: 'T-201',
    title: 'Project list API',
    feature: 'Projects',
    complexity: 3,
    uncertainty: 2,
    dependencies: ['T-101'],
    status: 'backlog'
  },
  {
    id: 'T-202',
    title: 'Project board UI',
    feature: 'Projects',
    complexity: 4,
    uncertainty: 2,
    dependencies: ['T-201'],
    status: 'backlog'
  }
]
