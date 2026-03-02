'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  authorizedTargetsOnly,
  buildDailyTasks,
  createNote,
  DEFAULT_TARGETS,
  dueReviews,
  markTaskComplete,
  scoreTasks,
  type PracticeNote,
  type TaskRecord
} from '../domain'
import { loadState, saveState } from './storage'

const DAY_MS = 86_400_000

const DEFAULT_TASKS: TaskRecord[] = [
  { id: 'task-1', title: 'Web enumeration checklist', targetId: 't1', difficulty: 2, estimatedMinutes: 25, lastCompletedDay: null, completionCount: 0 },
  { id: 'task-2', title: 'Packet triage drill', targetId: 't2', difficulty: 2, estimatedMinutes: 20, lastCompletedDay: null, completionCount: 0 },
  { id: 'task-3', title: 'Reverse engineering warmup', targetId: 't3', difficulty: 3, estimatedMinutes: 30, lastCompletedDay: null, completionCount: 0 }
]

export function SecurityTrackerStudio() {
  const [tasks, setTasks] = useState<TaskRecord[]>(DEFAULT_TASKS)
  const [notes, setNotes] = useState<PracticeNote[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-1')
  const [noteText, setNoteText] = useState('')

  const todayDay = Math.floor(Date.now() / DAY_MS)

  useEffect(() => {
    const persisted = loadState()
    if (persisted.tasks.length > 0) setTasks(persisted.tasks)
    if (persisted.notes.length > 0) setNotes(persisted.notes)
  }, [])

  useEffect(() => {
    saveState({ tasks, notes })
  }, [tasks, notes])

  const authorizedTargets = useMemo(() => authorizedTargetsOnly(DEFAULT_TARGETS), [])
  const dailyTasks = useMemo(() => buildDailyTasks(tasks, todayDay), [tasks, todayDay])
  const due = useMemo(() => dueReviews(tasks, todayDay), [tasks, todayDay])
  const score = useMemo(() => scoreTasks(tasks, notes.length, true), [tasks, notes])

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1100, padding: '1.5rem' }}>
      <h1>Security Practice Tracker</h1>
      <p>Track authorized practice sessions, notes, and review cadence.</p>
      <p style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.5rem' }}>
        For legal/safe use only: track activities on systems you own or are explicitly authorized to test.
      </p>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: '1rem' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Score</h2>
          <p>Total: <strong>{score.total}</strong></p>
          <p>Consistency: {score.consistency}</p>
          <p>Difficulty: {score.difficultyBonus}</p>
          <p>Safety docs: {score.safetyBonus}</p>
        </article>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Due Reviews</h2>
          {due.length === 0 ? <p>No reviews due.</p> : <ul>{due.map((item) => <li key={item.taskId}>{item.taskId} ({item.daysSince}d)</li>)}</ul>}
        </article>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Authorized Targets</h2>
          <ul>
            {authorizedTargets.map((target) => (
              <li key={target.id}>{target.name} ({target.category})</li>
            ))}
          </ul>
        </article>
      </section>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Daily Tasks</h2>
          <ul>
            {dailyTasks.map((task) => (
              <li key={task.id}>
                {task.title} ({task.estimatedMinutes}m, d{task.difficulty}){' '}
                <button
                  type="button"
                  onClick={() => setTasks((prev) => prev.map((item) => (item.id === task.id ? markTaskComplete(item, todayDay) : item)))}
                  style={{ border: '1px solid #1d4ed8', borderRadius: 6, background: '#1d4ed8', color: '#fff', padding: '0.2rem 0.5rem' }}
                >
                  Complete
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Notes</h2>
          <label htmlFor="task-select">Task</label>
          <select id="task-select" aria-label="task-select" value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.4rem', marginBottom: '0.5rem' }}>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
          <textarea aria-label="note-input" rows={5} value={noteText} onChange={(e) => setNoteText(e.target.value)} style={{ width: '100%', border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.5rem' }} />
          <button
            type="button"
            onClick={() => {
              if (!noteText.trim()) return
              setNotes((prev) => [createNote(selectedTaskId, noteText), ...prev])
              setNoteText('')
            }}
            style={{ marginTop: '0.5rem', border: '1px solid #0f766e', borderRadius: 6, background: '#0f766e', color: '#fff', padding: '0.25rem 0.6rem' }}
          >
            Save Note
          </button>
          <ul>
            {notes.slice(0, 8).map((note) => (
              <li key={note.id}>{new Date(note.createdAt).toLocaleDateString()} - {note.text}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}
