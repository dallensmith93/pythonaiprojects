import { describe, expect, it } from 'vitest'

import { groupIncidents, ingestSyntheticLogs } from '../domain'

describe('alert grouping', () => {
  it('groups repeated fingerprints into single incidents', () => {
    const logs = ingestSyntheticLogs('2026-01-01T00:00:00.000Z')
    const incidents = groupIncidents(logs)

    const billing = incidents.find((incident) => incident.fingerprint === 'billing-timeout-charge-sync')
    expect(billing).toBeDefined()
    expect(billing?.count).toBeGreaterThanOrEqual(2)
  })

  it('ignores info logs in incident grouping', () => {
    const logs = ingestSyntheticLogs('2026-01-01T00:00:00.000Z')
    const incidents = groupIncidents(logs)
    expect(incidents.some((incident) => incident.fingerprint === 'webhook-queue-normal')).toBe(false)
  })
})
