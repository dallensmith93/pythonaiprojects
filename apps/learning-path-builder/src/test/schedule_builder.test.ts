import { afterEach, describe, expect, it, vi } from 'vitest'

import { parseGoal } from '../domain/goal_parser'
import { DEFAULT_SKILLS } from '../domain/prerequisites'
import { buildWeeklyPlan } from '../domain/schedule_builder'
import type { ProgressRecord } from '../domain/progress'

const DAY_MS = 86_400_000

describe('buildWeeklyPlan', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps prerequisite order for learning tasks', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-01T12:00:00Z'))

    const goal = parseGoal('Learn TypeScript in 6 weeks with 5 study sessions')
    const tasks = buildWeeklyPlan(goal, DEFAULT_SKILLS, [])
    const learnSkills = tasks.filter((task) => task.type === 'learn').map((task) => task.skillId)

    expect(learnSkills[0]).toBe('fundamentals')
    expect(learnSkills).toContain('core-practice')
  })

  it('schedules due reviews alongside learning tasks', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-01T12:00:00Z'))
    const todayDay = Math.floor(Date.now() / DAY_MS)

    const records: ProgressRecord[] = [
      { skillId: 'fundamentals', mastery: 92, lastReviewedDay: todayDay - 8 }
    ]

    const goal = parseGoal('Math review in 8 weeks with 4 sessions')
    const tasks = buildWeeklyPlan(goal, DEFAULT_SKILLS, records)

    expect(tasks.some((task) => task.type === 'review' && task.skillId === 'fundamentals')).toBe(true)
    expect(tasks.some((task) => task.type === 'learn')).toBe(true)
  })

  it('caps sessions to realistic weekly pacing', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-01T12:00:00Z'))

    const goal = parseGoal('General upskill in 3 weeks with 12 sessions')
    const tasks = buildWeeklyPlan(goal, DEFAULT_SKILLS, [])
    const sessionDays = new Set(tasks.map((task) => task.day))

    expect(sessionDays.size).toBeLessThanOrEqual(7)
  })
})
