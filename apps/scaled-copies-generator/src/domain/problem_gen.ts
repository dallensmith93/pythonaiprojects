export type Operation = 'add' | 'sub' | 'mul'

export interface MathProblem {
  id: string
  prompt: string
  a: number
  b: number
  operation: Operation
}

export interface ProblemSet {
  id: string
  title: string
  level: 1 | 2 | 3
  problems: MathProblem[]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function chooseOperation(level: 1 | 2 | 3): Operation {
  if (level === 1) return Math.random() < 0.5 ? 'add' : 'sub'
  if (level === 2) return Math.random() < 0.6 ? 'mul' : 'add'
  return Math.random() < 0.7 ? 'mul' : 'sub'
}

function operandRange(level: 1 | 2 | 3): [number, number] {
  if (level === 1) return [1, 20]
  if (level === 2) return [5, 50]
  return [10, 120]
}

export function generateProblem(level: 1 | 2 | 3, index: number): MathProblem {
  const [min, max] = operandRange(level)
  const operation = chooseOperation(level)
  let a = randInt(min, max)
  let b = randInt(min, max)

  if (operation === 'sub' && b > a) {
    const t = a
    a = b
    b = t
  }

  const symbol = operation === 'add' ? '+' : operation === 'sub' ? '-' : 'x'
  return {
    id: `p-${index + 1}`,
    a,
    b,
    operation,
    prompt: `${a} ${symbol} ${b} = ?`
  }
}

export function generateProblemSet(title: string, level: 1 | 2 | 3, count: number): ProblemSet {
  const safeCount = Math.max(1, Math.min(40, count))
  return {
    id: `set-${Date.now()}`,
    title,
    level,
    problems: Array.from({ length: safeCount }, (_, idx) => generateProblem(level, idx))
  }
}
