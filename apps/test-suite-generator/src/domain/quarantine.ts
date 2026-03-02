import type { FlakeScore } from './flake_scoring'

export function suggestQuarantine(scores: FlakeScore[]): string[] {
  return scores.filter((score) => score.level === 'flaky').map((score) => score.testId)
}
