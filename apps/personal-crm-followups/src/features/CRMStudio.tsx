'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  DEFAULT_CONTACTS,
  remindersForDay,
  renderFollowupDraft,
  summarizePipeline,
  updateContactStage,
  type Contact,
  type PipelineStage
} from '../domain'
import { loadContacts, saveContacts } from './storage'

const DAY_MS = 86_400_000

export function CRMStudio() {
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS)
  const [selectedContactId, setSelectedContactId] = useState<string>(DEFAULT_CONTACTS[0].id)
  const [topic, setTopic] = useState('our next steps')

  const todayDay = Math.floor(Date.now() / DAY_MS)

  useEffect(() => {
    const saved = loadContacts()
    if (saved.length > 0) setContacts(saved)
  }, [])

  useEffect(() => {
    saveContacts(contacts)
  }, [contacts])

  const pipeline = useMemo(() => summarizePipeline(contacts), [contacts])
  const reminders = useMemo(() => remindersForDay(contacts, todayDay), [contacts, todayDay])
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? contacts[0]
  const draft = selectedContact ? renderFollowupDraft(selectedContact, topic) : ''

  function changeStage(contactId: string, stage: PipelineStage): void {
    setContacts((prev) => prev.map((contact) => (contact.id === contactId ? updateContactStage(contact, stage) : contact)))
  }

  function markContacted(contactId: string): void {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId ? { ...contact, lastContactDay: todayDay } : contact
      )
    )
  }

  return (
    <main style={{ fontFamily: 'ui-sans-serif, Segoe UI, sans-serif', margin: '0 auto', maxWidth: 1120, padding: '1.5rem' }}>
      <h1>Personal CRM</h1>
      <p>Track contacts, pipeline stages, and follow-up reminders.</p>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: '1rem' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Pipeline</h2>
          <ul>
            {pipeline.map((row) => (
              <li key={row.stage}>{row.stage}: <strong>{row.count}</strong></li>
            ))}
          </ul>
        </article>

        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Reminders ({reminders.length})</h2>
          {reminders.length === 0 ? (
            <p>No upcoming follow-ups.</p>
          ) : (
            <ul>
              {reminders.map((reminder) => {
                const contact = contacts.find((c) => c.id === reminder.contactId)
                return (
                  <li key={reminder.contactId}>
                    {contact?.name} ({reminder.priority}) due in {reminder.dueInDays}d
                  </li>
                )
              })}
            </ul>
          )}
        </article>
      </section>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Contacts</h2>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} style={{ marginBottom: 8 }}>
                <strong>{contact.name}</strong> ({contact.company})
                <div>{contact.email}</div>
                <label>
                  Stage{' '}
                  <select aria-label={`stage-${contact.id}`} value={contact.stage} onChange={(e) => changeStage(contact.id, e.target.value as PipelineStage)}>
                    <option value="lead">lead</option>
                    <option value="active">active</option>
                    <option value="proposal">proposal</option>
                    <option value="closed">closed</option>
                  </select>
                </label>
                <button type="button" onClick={() => markContacted(contact.id)} style={{ marginLeft: 8 }}>
                  Mark Contacted Today
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article style={{ border: '1px solid #d4d4d8', borderRadius: 10, padding: '0.75rem' }}>
          <h2 style={{ marginTop: 0 }}>Follow-up Draft</h2>
          <label>
            Contact
            <select aria-label="contact-select" value={selectedContactId} onChange={(e) => setSelectedContactId(e.target.value)} style={{ marginLeft: 6 }}>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            Topic
            <input aria-label="draft-topic" value={topic} onChange={(e) => setTopic(e.target.value)} style={{ marginLeft: 6 }} />
          </label>
          <textarea aria-label="draft-preview" readOnly rows={6} value={draft} style={{ width: '100%', marginTop: 8, border: '1px solid #a1a1aa', borderRadius: 8, padding: '0.5rem' }} />
        </article>
      </section>
    </main>
  )
}
