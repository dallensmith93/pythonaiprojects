import type { FixPlan } from './fix_plans'

export function renderSafeScript(plan: FixPlan): string {
  const lines = ['# Safe fix checklist script', `# ${plan.title}`, '']
  for (const step of plan.steps) {
    lines.push(`# - ${step}`)
  }
  return lines.join('\n')
}
