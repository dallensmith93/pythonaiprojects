'use client'

import React from 'react'

import { gradebookActions, selectDerivedView, useGradebookStore } from '../state/gradebookStore'

function statusColor(status: string): string {
  if (status === 'mastered') return '#22c55e'
  if (status === 'developing') return '#f59e0b'
  return '#e5e7eb'
}

export function GradebookPage() {
  const state = useGradebookStore((s) => s)
  const derived = selectDerivedView(state)

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1200 }}>
      <h1>Mastery-Based Gradebook</h1>
      <p>Track standards mastery, prerequisite unlocks, and student progress.</p>

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 16, alignItems: 'start' }}>
        <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Students</h2>
          <ul>
            {state.students.map((student) => (
              <li key={student.id}>
                <button type='button' onClick={() => gradebookActions.selectStudent(student.id)}>
                  {student.name} (Grade {student.gradeLevel})
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Student Detail</h2>
          <p><strong>{derived.selectedStudent.name}</strong> - Mastery {derived.progress.masteryPercent}%</p>
          <ul>
            <li>Mastered: {derived.progress.masteredCount}</li>
            <li>Developing: {derived.progress.developingCount}</li>
            <li>Not started: {derived.progress.notStartedCount}</li>
          </ul>

          <h3>Per-standard mastery</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Standard</th>
                <th style={{ textAlign: 'left' }}>Status</th>
                <th style={{ textAlign: 'left' }}>Latest</th>
                <th style={{ textAlign: 'left' }}>Avg</th>
              </tr>
            </thead>
            <tbody>
              {derived.mastery.map((row) => {
                const standard = state.standards.find((s) => s.id === row.standardId)
                return (
                  <tr key={row.standardId}>
                    <td>{standard?.code}</td>
                    <td>{row.status}</td>
                    <td>{row.latestScore ?? '-'}</td>
                    <td>{row.averageScore}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <h3>Unlocked next standards</h3>
          {derived.unlockable.length === 0 ? (
            <p>All available standards for this progression path are mastered.</p>
          ) : (
            <ul>
              {derived.unlockable.map((standard) => (
                <li key={standard.id}>{standard.code} - {standard.title}</li>
              ))}
            </ul>
          )}

          <h3>Record score</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {state.standards.map((standard) => (
              <button
                key={standard.id}
                type='button'
                onClick={() => gradebookActions.recordScore(derived.selectedStudent.id, standard.id, 85)}
                title={`Add score for ${standard.code}`}
              >
                +{standard.code}
              </button>
            ))}
            <button type='button' onClick={() => gradebookActions.resetScores()}>Reset scores</button>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16, border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
        <h2>Mastery Heatmap</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Student</th>
                {state.standards.map((standard) => (
                  <th key={standard.id} style={{ textAlign: 'left' }}>{standard.code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  {state.standards.map((standard) => {
                    const cell = derived.heatmap.find((entry) => entry.studentId === student.id && entry.standardId === standard.id)
                    return (
                      <td key={standard.id}>
                        <span
                          style={{
                            display: 'inline-block',
                            minWidth: 90,
                            padding: '2px 6px',
                            borderRadius: 6,
                            background: statusColor(cell?.status ?? 'not_started')
                          }}
                        >
                          {cell?.status ?? 'not_started'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
