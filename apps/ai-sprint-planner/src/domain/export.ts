import type { SprintPlan } from './capacity_planning'

export function exportSprintPlanMarkdown(plans: SprintPlan[]): string {
  const lines: string[] = ['# Sprint Plan']
  for (const plan of plans) {
    lines.push('')
    lines.push(`## ${plan.sprintId}`)
    lines.push(`- Total points: ${plan.totalPoints}`)
    for (const id of plan.ticketIds) {
      lines.push(`- ${id}`)
    }
  }
  return lines.join('\n')
}
