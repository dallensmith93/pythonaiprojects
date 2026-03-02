export interface FlowStep {
  id: string
  action: string
  expected: string
}

export interface RecordedFlow {
  id: string
  name: string
  steps: FlowStep[]
}

export const SAMPLE_FLOWS: RecordedFlow[] = [
  {
    id: 'flow-login',
    name: 'User login flow',
    steps: [
      { id: 's1', action: 'Open login page', expected: 'Login form visible' },
      { id: 's2', action: 'Submit valid credentials', expected: 'Redirect to dashboard' },
      { id: 's3', action: 'Read welcome banner', expected: 'User name displayed' }
    ]
  },
  {
    id: 'flow-settings',
    name: 'Update profile settings',
    steps: [
      { id: 's1', action: 'Open settings page', expected: 'Settings form visible' },
      { id: 's2', action: 'Change timezone and save', expected: 'Success message shown' }
    ]
  }
]
