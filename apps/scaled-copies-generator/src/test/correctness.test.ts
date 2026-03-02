import { describe, expect, it } from 'vitest'

import { buildAnswerKey, generateProblemSet } from '../domain'

describe('problem generation correctness', () => {
  it('produces expected number of problems and solvable prompts', () => {
    const set = generateProblemSet('Test Set', 2, 12)
    expect(set.problems.length).toBe(12)
    expect(set.problems.every((p) => /\= \?/.test(p.prompt))).toBe(true)
  })

  it('answer key matches arithmetic for each operation', () => {
    const set = generateProblemSet('Math Check', 3, 20)
    const key = buildAnswerKey(set.problems)

    for (const problem of set.problems) {
      const answer = key.find((k) => k.id === problem.id)
      expect(answer).toBeDefined()

      const expected = problem.operation === 'add'
        ? problem.a + problem.b
        : problem.operation === 'sub'
          ? problem.a - problem.b
          : problem.a * problem.b

      expect(answer!.answer).toBe(expected)
    }
  })
})
