import type { MathProblem } from './problem_gen'

export interface AnswerKeyItem {
  id: string
  answer: number
}

export function solveProblem(problem: MathProblem): number {
  if (problem.operation === 'add') return problem.a + problem.b
  if (problem.operation === 'sub') return problem.a - problem.b
  return problem.a * problem.b
}

export function buildAnswerKey(problems: MathProblem[]): AnswerKeyItem[] {
  return problems.map((problem) => ({
    id: problem.id,
    answer: solveProblem(problem)
  }))
}
