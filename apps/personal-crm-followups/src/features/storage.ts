import type { Contact } from '../domain'

const KEY = 'personal-crm-followups.contacts.v1'

export function loadContacts(): Contact[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Contact[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveContacts(contacts: Contact[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(contacts))
}
