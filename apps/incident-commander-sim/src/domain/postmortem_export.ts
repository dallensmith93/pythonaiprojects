import type { SimulationScore } from './scoring'
import type { SimulationState } from './sim_engine'

export function exportPostmortemMarkdown(state: SimulationState, score: SimulationScore): string {
  return [
    '# Incident Postmortem',
    '',
    `- Final status: ${state.status}`,
    `- Phase reached: ${state.phase}`,
    `- Duration (ticks): ${state.tick}`,
    `- Final severity: ${state.severity}`,
    `- Customer impact: ${state.customerImpact}`,
    '',
    '## Score',
    `- Total: ${score.total} (${score.grade})`,
    `- Timeliness: ${score.timeliness}`,
    `- Decision quality: ${score.decisionQuality}`,
    `- Stability: ${score.stability}`,
    '',
    '## Recommendations',
    ...score.recommendations.map((recommendation) => `- ${recommendation}`)
  ].join('\n')
}
