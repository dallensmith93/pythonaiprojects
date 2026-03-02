import type { Contact } from './contacts'

const DEFAULT_TEMPLATE = 'Hi {{name}}, checking in on {{topic}}. Open to a quick update this week?'

export function renderFollowupDraft(contact: Contact, topic: string): string {
  return DEFAULT_TEMPLATE
    .replace('{{name}}', contact.name)
    .replace('{{topic}}', topic)
}
