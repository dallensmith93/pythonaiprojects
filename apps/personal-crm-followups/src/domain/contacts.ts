export type PipelineStage = 'lead' | 'active' | 'proposal' | 'closed'

export interface Contact {
  id: string
  name: string
  company: string
  email: string
  stage: PipelineStage
  lastContactDay: number
  followupIntervalDays: number
}

export const DEFAULT_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Avery Kim', company: 'Northline', email: 'avery@northline.dev', stage: 'lead', lastContactDay: 0, followupIntervalDays: 5 },
  { id: 'c2', name: 'Jordan Lee', company: 'Sable Labs', email: 'jordan@sable.io', stage: 'active', lastContactDay: 0, followupIntervalDays: 4 }
]

export function updateContactStage(contact: Contact, stage: PipelineStage): Contact {
  return { ...contact, stage }
}
