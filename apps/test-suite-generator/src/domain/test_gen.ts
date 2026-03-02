import type { RecordedFlow } from './flow_recorder'

export interface GeneratedTestCase {
  id: string
  title: string
  body: string
  flowId: string
}

export function generateTestsFromFlow(flow: RecordedFlow): GeneratedTestCase[] {
  const title = `test('${flow.name.toLowerCase()}', async () => {` 
  const lines = [title]

  for (const step of flow.steps) {
    lines.push(`  // ${step.action}`)
    lines.push(`  // expect: ${step.expected}`)
  }

  lines.push('})')

  return [
    {
      id: `tc-${flow.id}`,
      title: `${flow.name} smoke`,
      body: lines.join('\n'),
      flowId: flow.id
    }
  ]
}

export function generateTests(flows: RecordedFlow[]): GeneratedTestCase[] {
  return flows.flatMap((flow) => generateTestsFromFlow(flow))
}
