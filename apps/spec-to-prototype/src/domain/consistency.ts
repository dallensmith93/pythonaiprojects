import type { PrdOutput } from './prd'
import type { ApiSchemaOutput } from './schemas'
import type { UiSkeletonOutput } from './ui_skeleton'

export interface ConsistencyResult {
  aligned: boolean
  issues: string[]
}

export function checkConsistency(prd: PrdOutput, api: ApiSchemaOutput, ui: UiSkeletonOutput): ConsistencyResult {
  const issues: string[] = []

  if (prd.goals.length === 0) issues.push('PRD goals are missing.')
  if (api.endpoints.length === 0) issues.push('API endpoints are missing.')
  if (ui.pages.length === 0) issues.push('UI pages are missing.')

  const hasListEndpoint = api.endpoints.some((e) => e.method === 'GET')
  if (!hasListEndpoint) issues.push('API should include at least one GET endpoint for list/read flow.')

  const hasDashboardPage = ui.pages.some((p) => p.toLowerCase().includes('dashboard'))
  if (!hasDashboardPage) issues.push('UI should include a dashboard or overview page.')

  const hasMetricGoal = prd.successMetrics.length > 0
  if (!hasMetricGoal) issues.push('PRD should define at least one success metric.')

  return { aligned: issues.length === 0, issues }
}
