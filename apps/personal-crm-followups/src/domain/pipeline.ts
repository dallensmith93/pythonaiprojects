import type { Contact, PipelineStage } from './contacts'

export interface StageSummary {
  stage: PipelineStage
  count: number
}

const STAGES: PipelineStage[] = ['lead', 'active', 'proposal', 'closed']

export function summarizePipeline(contacts: Contact[]): StageSummary[] {
  return STAGES.map((stage) => ({
    stage,
    count: contacts.filter((contact) => contact.stage === stage).length
  }))
}
