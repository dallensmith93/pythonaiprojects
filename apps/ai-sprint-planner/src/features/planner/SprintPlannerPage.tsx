'use client'

import React, { useMemo, useState } from 'react'

import { selectDerived, sprintActions, useSprintStore } from '../state/sprintStore'
import type { Ticket, TicketStatus } from '../../domain'

const STATUSES: TicketStatus[] = ['backlog', 'in_sprint', 'done']

function label(status: TicketStatus): string {
  if (status === 'backlog') return 'Backlog'
  if (status === 'in_sprint') return 'In Sprint'
  return 'Done'
}

export function SprintPlannerPage() {
  const state = useSprintStore((s) => s)
  const derived = useMemo(() => selectDerived(state), [state])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(state.tickets[0]?.id ?? null)

  const selected = state.tickets.find((ticket) => ticket.id === selectedTicketId) ?? null

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1280 }}>
      <h1>AI Sprint Planner</h1>
      <p>Turn features into tickets, validate dependencies, and generate sprint plans by capacity.</p>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <strong>Backlog points:</strong> {derived.backlogPoints}
        <label style={{ marginLeft: 8 }}>
          Sprint Capacity
          <input
            type='number'
            value={state.sprintCapacityPoints}
            onChange={(event) => sprintActions.setSprintCapacity(Number(event.target.value))}
            style={{ marginLeft: 4 }}
          />
        </label>
        <button type='button' style={{ marginLeft: 8 }} onClick={() => sprintActions.resetDefaults()}>Reset</button>
      </section>

      {!derived.validation.valid ? (
        <section style={{ border: '1px solid #fca5a5', borderRadius: 8, padding: 12, background: '#fff1f2', marginBottom: 12 }}>
          <h2>Invalid Dependencies</h2>
          {derived.validation.missingDependencies.map((item) => (
            <p key={`${item.ticketId}-${item.missingDependencyId}`}>Missing: {item.ticketId} depends on {item.missingDependencyId}</p>
          ))}
          {derived.validation.cycle ? <p>Cycle: {derived.validation.cycle.join(' -> ')}</p> : null}
        </section>
      ) : null}

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Kanban</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            {STATUSES.map((status) => (
              <div key={status} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                <h3>{label(status)}</h3>
                {state.tickets.filter((ticket) => ticket.status === status).map((ticket) => (
                  <article key={ticket.id} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 6, marginBottom: 6 }}>
                    <button type='button' onClick={() => setSelectedTicketId(ticket.id)}>
                      <strong>{ticket.id}</strong> {ticket.title}
                    </button>
                    <div>Feature: {ticket.feature}</div>
                    <div>Estimate: {derived.estimateById[ticket.id]} pts</div>
                    <div>Deps: {ticket.dependencies.length === 0 ? 'none' : ticket.dependencies.join(', ')}</div>
                    <div style={{ marginTop: 6 }}>
                      {STATUSES.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          type='button'
                          disabled={ticket.status === nextStatus}
                          onClick={() => sprintActions.setTicketStatus(ticket.id, nextStatus)}
                          style={{ marginRight: 4 }}
                        >
                          {label(nextStatus)}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Dependency View</h2>
          {selected ? (
            <>
              <p><strong>{selected.id}</strong> - {selected.title}</p>
              <p>Upstream: {selected.dependencies.length === 0 ? 'none' : selected.dependencies.join(', ')}</p>
              <p>
                Downstream:{' '}
                {state.tickets
                  .filter((ticket) => ticket.dependencies.includes(selected.id))
                  .map((ticket) => ticket.id)
                  .join(', ') || 'none'}
              </p>
            </>
          ) : (
            <p>Select a ticket card to inspect dependencies.</p>
          )}

          <h2>Sprint Plan</h2>
          {derived.plans.length === 0 ? (
            <p>No plan available (fix invalid dependencies first).</p>
          ) : (
            <ul>
              {derived.plans.map((plan) => (
                <li key={plan.sprintId}>
                  <strong>{plan.sprintId}</strong> ({plan.totalPoints} pts): {plan.ticketIds.join(', ')}
                </li>
              ))}
            </ul>
          )}

          <h2>Topological Order</h2>
          <p>{derived.ordered.join(' -> ') || 'Unavailable'}</p>
        </section>
      </section>
    </main>
  )
}
