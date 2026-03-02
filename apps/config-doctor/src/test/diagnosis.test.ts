import { describe, expect, it } from 'vitest'

import { buildFixPlans } from '../domain/fix_plans'
import { runDiagnostics } from '../domain/diagnostics'
import { matchRules } from '../domain/rule_engine'

describe('diagnosis pipeline', () => {
  it('detects missing tools and creates plans', () => {
    const issues = runDiagnostics({
      os: 'windows',
      nodeInstalled: false,
      pnpmInstalled: false,
      gitInstalled: true,
      pythonInstalled: true,
      envPathHealthy: true
    })

    const plans = buildFixPlans(matchRules(issues))
    expect(issues.length).toBeGreaterThan(0)
    expect(plans.some((plan) => plan.title.includes('Node'))).toBe(true)
  })

  it('keeps only safe fix steps', () => {
    const plans = buildFixPlans([
      {
        issueId: 'x',
        title: 'Unsafe test',
        rationale: 'test',
        safeFixSteps: ['Run: node -v', 'rm -rf /']
      }
    ])

    expect(plans[0].steps.some((step) => /rm -rf/i.test(step))).toBe(false)
  })
})
