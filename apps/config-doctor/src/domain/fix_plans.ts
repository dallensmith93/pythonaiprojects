import type { RuleMatch } from './rule_engine'
import { guardFixSteps } from './safety_guardrails'

export interface FixPlan {
  id: string
  issueId: string
  title: string
  rationale: string
  steps: string[]
  safe: boolean
}

export function buildFixPlans(matches: RuleMatch[]): FixPlan[] {
  return matches.map((match, idx) => {
    const safeSteps = guardFixSteps(match.safeFixSteps)
    return {
      id: `plan-${idx + 1}`,
      issueId: match.issueId,
      title: match.title,
      rationale: match.rationale,
      steps: safeSteps,
      safe: safeSteps.length === match.safeFixSteps.length
    }
  })
}
