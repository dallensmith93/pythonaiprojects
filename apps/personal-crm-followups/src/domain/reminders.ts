import type { Contact } from './contacts'

export interface Reminder {
  contactId: string
  dueInDays: number
  priority: 'high' | 'medium'
}

export function remindersForDay(contacts: Contact[], todayDay: number): Reminder[] {
  return contacts
    .map((contact) => {
      const dueInDays = contact.followupIntervalDays - (todayDay - contact.lastContactDay)
      return {
        contactId: contact.id,
        dueInDays,
        priority: dueInDays <= 0 ? 'high' as const : 'medium' as const
      }
    })
    .filter((reminder) => reminder.dueInDays <= 2)
    .sort((a, b) => a.dueInDays - b.dueInDays)
}
