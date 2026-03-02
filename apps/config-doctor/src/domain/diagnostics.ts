export interface EnvSnapshot {
  os: 'windows' | 'mac' | 'linux'
  nodeInstalled: boolean
  pnpmInstalled: boolean
  gitInstalled: boolean
  pythonInstalled: boolean
  envPathHealthy: boolean
}

export interface DiagnosticIssue {
  id: string
  severity: 'high' | 'medium' | 'low'
  message: string
  area: 'runtime' | 'package-manager' | 'source-control' | 'path'
}

export function runDiagnostics(snapshot: EnvSnapshot): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = []

  if (!snapshot.nodeInstalled) {
    issues.push({ id: 'missing-node', severity: 'high', area: 'runtime', message: 'Node.js is missing.' })
  }
  if (!snapshot.pnpmInstalled) {
    issues.push({ id: 'missing-pnpm', severity: 'medium', area: 'package-manager', message: 'pnpm is not installed.' })
  }
  if (!snapshot.gitInstalled) {
    issues.push({ id: 'missing-git', severity: 'medium', area: 'source-control', message: 'Git is not installed.' })
  }
  if (!snapshot.pythonInstalled) {
    issues.push({ id: 'missing-python', severity: 'medium', area: 'runtime', message: 'Python is missing.' })
  }
  if (!snapshot.envPathHealthy) {
    issues.push({ id: 'broken-path', severity: 'high', area: 'path', message: 'PATH appears misconfigured for dev tools.' })
  }

  return issues
}
