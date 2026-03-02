import type { LogEvent } from './log_ingest'

export interface IncidentGroup {
  incidentId: string
  fingerprint: string
  serviceId: string
  serviceName: string
  severity: 'warning' | 'critical'
  count: number
  firstSeenIso: string
  lastSeenIso: string
  sampleMessage: string
}

export function groupIncidents(logs: LogEvent[]): IncidentGroup[] {
  const map = new Map<string, IncidentGroup>()

  for (const log of logs.filter((entry) => entry.level !== 'info')) {
    const key = `${log.serviceId}:${log.fingerprint}`
    const existing = map.get(key)

    if (!existing) {
      map.set(key, {
        incidentId: `inc-${key}`,
        fingerprint: log.fingerprint,
        serviceId: log.serviceId,
        serviceName: log.serviceName,
        severity: log.level === 'error' ? 'critical' : 'warning',
        count: 1,
        firstSeenIso: log.timestampIso,
        lastSeenIso: log.timestampIso,
        sampleMessage: log.message
      })
      continue
    }

    existing.count += 1
    existing.lastSeenIso = log.timestampIso > existing.lastSeenIso ? log.timestampIso : existing.lastSeenIso
    if (log.level === 'error') {
      existing.severity = 'critical'
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count)
}
