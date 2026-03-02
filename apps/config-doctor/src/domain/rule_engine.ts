import type { DiagnosticIssue } from './diagnostics'

export interface RuleMatch {
  issueId: string
  title: string
  rationale: string
  safeFixSteps: string[]
}

const RULES: Record<string, Omit<RuleMatch, 'issueId'>> = {
  'missing-node': {
    title: 'Install Node.js LTS',
    rationale: 'Most modern JS tooling requires Node runtime.',
    safeFixSteps: ['Download Node.js LTS from official site.', 'Open a new terminal.', 'Run: node -v']
  },
  'missing-pnpm': {
    title: 'Install pnpm package manager',
    rationale: 'Workspace scripts depend on pnpm.',
    safeFixSteps: ['Install pnpm via official docs.', 'Run: pnpm -v']
  },
  'missing-git': {
    title: 'Install Git',
    rationale: 'Git is needed for source control workflows.',
    safeFixSteps: ['Install Git from official installer.', 'Run: git --version']
  },
  'missing-python': {
    title: 'Install Python 3',
    rationale: 'Some backend and tooling workflows rely on Python.',
    safeFixSteps: ['Install Python 3 from official source.', 'Run: python --version']
  },
  'broken-path': {
    title: 'Repair PATH entries',
    rationale: 'Tools cannot run if PATH is missing installation folders.',
    safeFixSteps: ['Review PATH entries in system settings.', 'Re-add tool install directories.', 'Restart terminal and re-check tool versions.']
  }
}

export function matchRules(issues: DiagnosticIssue[]): RuleMatch[] {
  return issues
    .map((issue) => {
      const rule = RULES[issue.id]
      if (!rule) return null
      return { issueId: issue.id, ...rule }
    })
    .filter((entry): entry is RuleMatch => entry !== null)
}
