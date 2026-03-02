'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  buildWeeklyPlan,
  DEFAULT_SKILLS,
  parseGoal,
  summarizeProgress,
  type PlannedTask,
  type ProgressRecord
} from '../domain'
import { loadProgressRecords, saveProgressRecords } from './storage'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const PROGRESS_STEP = 12

function updateMastery(records: ProgressRecord[], skillId: string, gain: number): ProgressRecord[] {
  const now = Math.floor(Date.now() / 86_400_000)
  const existing = records.find((record) => record.skillId === skillId)
  if (!existing) {
    return [...records, { skillId, mastery: Math.min(100, gain), lastReviewedDay: now }]
  }

  return records.map((record) =>
    record.skillId === skillId
      ? { ...record, mastery: Math.min(100, record.mastery + gain), lastReviewedDay: now }
      : record
  )
}

function scoreTask(task: PlannedTask): number {
  return task.type === 'review' ? Math.round(task.minutes * 0.7) : task.minutes
}

export function LearningPathPlanner() {
  const [goalInput, setGoalInput] = useState('Learn TypeScript fundamentals in 6 weeks with 5 study sessions')
  const [records, setRecords] = useState<ProgressRecord[]>([])
  const [selectedTask, setSelectedTask] = useState<PlannedTask | null>(null)

  useEffect(() => {
    setRecords(loadProgressRecords())
  }, [])

  useEffect(() => {
    saveProgressRecords(records)
  }, [records])

  const goal = useMemo(() => parseGoal(goalInput), [goalInput])
  const progress = useMemo(() => summarizeProgress(DEFAULT_SKILLS, records), [records])
  const weeklyPlan = useMemo(() => buildWeeklyPlan(goal, DEFAULT_SKILLS, records), [goal, records])
  const tasksByDay = useMemo(() => {
    const bucket = new Map<string, PlannedTask[]>()
    for (const day of DAYS) bucket.set(day, [])
    for (const task of weeklyPlan) {
      bucket.set(task.day, [...(bucket.get(task.day) ?? []), task])
    }
    return bucket
  }, [weeklyPlan])
  const totalScore = useMemo(() => weeklyPlan.reduce((sum, task) => sum + scoreTask(task), 0), [weeklyPlan])

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1100, padding: '1.5rem' }}>
      <h1>Learning Path Builder</h1>
      <p>Adaptive weekly planning with prerequisite-aware pacing and spaced repetition.</p>

      <section style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <h2>Goal + Pacing</h2>
        <label htmlFor="goal" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Goal statement
        </label>
        <input
          id="goal"
          style={{ width: '100%', padding: '0.55rem', border: '1px solid #a1a1aa', borderRadius: 8 }}
          value={goalInput}
          onChange={(event) => setGoalInput(event.target.value)}
        />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <span>Domain: <strong>{goal.domain}</strong></span>
          <span>Target: <strong>{goal.targetWeeks} weeks</strong></span>
          <span>Sessions/week: <strong>{goal.sessionsPerWeek}</strong></span>
        </div>
      </section>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start' }}>
        <div style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem' }}>
          <h2>Weekly Calendar</h2>
          <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
            {DAYS.map((day) => (
              <article key={day} style={{ border: '1px solid #e4e4e7', borderRadius: 8, padding: '0.5rem', minHeight: 190 }}>
                <h3 style={{ marginTop: 0 }}>{day}</h3>
                {(tasksByDay.get(day) ?? []).length === 0 ? (
                  <p style={{ color: '#71717a', margin: 0 }}>No session</p>
                ) : (
                  (tasksByDay.get(day) ?? []).map((task) => (
                    <button
                      key={`${task.day}-${task.skillId}-${task.type}`}
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        marginBottom: 8,
                        borderRadius: 8,
                        border: '1px solid #a1a1aa',
                        background: task.type === 'review' ? '#eef2ff' : '#ecfeff',
                        padding: '0.5rem'
                      }}
                    >
                      <strong>{task.type === 'review' ? 'Review' : 'Learn'}</strong>
                      <div>{task.skillId}</div>
                      <small>{task.minutes} min</small>
                    </button>
                  ))
                )}
              </article>
            ))}
          </div>
        </div>

        <aside style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '1rem' }}>
          <h2>Action Panel</h2>
          {selectedTask ? (
            <>
              <p style={{ marginBottom: 6 }}><strong>{selectedTask.skillId}</strong></p>
              <p style={{ marginTop: 0 }}>{selectedTask.note}</p>
              <button
                type="button"
                onClick={() => {
                  setRecords((prev) => updateMastery(prev, selectedTask.skillId, PROGRESS_STEP))
                  setSelectedTask(null)
                }}
                style={{ borderRadius: 8, border: '1px solid #2563eb', background: '#2563eb', color: '#fff', padding: '0.45rem 0.75rem' }}
              >
                Mark complete (+{PROGRESS_STEP} mastery)
              </button>
            </>
          ) : (
            <p style={{ color: '#71717a' }}>Select a task to log completion.</p>
          )}

          <hr style={{ margin: '1rem 0' }} />
          <h3>Progress</h3>
          <p>Average mastery: <strong>{progress.avgMastery}%</strong></p>
          <p>Completed skills: <strong>{progress.completed.length}</strong></p>
          <p>In progress: <strong>{progress.inProgress.length}</strong></p>
          <p>Plan score: <strong>{totalScore}</strong></p>
        </aside>
      </section>
    </main>
  )
}
