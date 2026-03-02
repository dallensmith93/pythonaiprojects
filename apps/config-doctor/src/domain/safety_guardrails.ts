const BLOCKED_PATTERNS = [/rm\s+-rf/i, /del\s+\/f/i, /format\s+/i, /reg\s+delete/i, /sudo\s+rm/i]

export function isSafeCommand(command: string): boolean {
  return !BLOCKED_PATTERNS.some((pattern) => pattern.test(command))
}

export function guardFixSteps(steps: string[]): string[] {
  return steps.filter((step) => isSafeCommand(step))
}
