import { describe, expect, it } from 'vitest'

import type { Contact } from '../domain/contacts'
import { remindersForDay } from '../domain/reminders'

describe('reminder logic', () => {
  it('flags overdue reminders as high priority', () => {
    const contacts: Contact[] = [
      { id: 'a', name: 'A', company: 'X', email: 'a@x.dev', stage: 'lead', lastContactDay: 1, followupIntervalDays: 3 }
    ]

    const reminders = remindersForDay(contacts, 6)
    expect(reminders[0].priority).toBe('high')
  })

  it('returns near-due reminders within two days', () => {
    const contacts: Contact[] = [
      { id: 'a', name: 'A', company: 'X', email: 'a@x.dev', stage: 'active', lastContactDay: 8, followupIntervalDays: 3 }
    ]

    const reminders = remindersForDay(contacts, 9)
    expect(reminders.length).toBe(1)
    expect(reminders[0].dueInDays).toBe(2)
  })
})
