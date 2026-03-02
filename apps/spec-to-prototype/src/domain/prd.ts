export interface PrdOutput {
  title: string
  problem: string
  goals: string[]
  users: string[]
  successMetrics: string[]
}

export function generatePrd(featureIdea: string): PrdOutput {
  const trimmed = featureIdea.trim() || 'Untitled Product'
  return {
    title: `${trimmed} PRD`,
    problem: `Users need a reliable workflow for ${trimmed.toLowerCase()}.`,
    goals: [
      'Deliver a clear end-to-end user flow.',
      'Reduce manual coordination and errors.',
      'Provide measurable outcome tracking.'
    ],
    users: ['Primary operator', 'Team lead', 'Reviewer'],
    successMetrics: ['Task completion rate', 'Time to first value', 'Weekly active users']
  }
}
