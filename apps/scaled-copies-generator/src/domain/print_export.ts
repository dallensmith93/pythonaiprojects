import type { AnswerKeyItem } from './answer_keys'
import type { ProblemSet } from './problem_gen'

export function toPrintableWorksheet(set: ProblemSet): string {
  const lines = [`# ${set.title}`, `Level: ${set.level}`, '']
  for (const problem of set.problems) {
    lines.push(`${problem.id}. ${problem.prompt}`)
  }
  return lines.join('\n')
}

export function toPrintableAnswerKey(key: AnswerKeyItem[]): string {
  const lines = ['# Answer Key', '']
  for (const item of key) lines.push(`${item.id}: ${item.answer}`)
  return lines.join('\n')
}
