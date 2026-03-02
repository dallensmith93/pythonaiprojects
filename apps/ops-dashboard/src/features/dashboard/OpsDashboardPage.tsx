'use client'

import React, { useMemo } from 'react'

import { opsActions, selectDerived, useOpsStore } from '../state/opsStore'

export function OpsDashboardPage() {
  const state = useOpsStore((s) => s)
  const derived = useMemo(() => selectDerived(state), [state])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1280 }}>
      <h1>Personal Ops Dashboard</h1>
      <p>Monitor service health, grouped incidents, and alert signals without noisy duplicates.</p>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <button type='button' onClick={() => opsActions.runChecks()}>Run Health Checks</button>
        <button type='button' onClick={() => opsActions.ingestLogs()} style={{ marginLeft: 8 }}>Ingest Logs</button>
        <button type='button' onClick={() => opsActions.reset()} style={{ marginLeft: 8 }}>Reset</button>
      </section>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <h2>Status</h2>
        <p>Overall: <strong>{derived.status.overall}</strong></p>
        <p>Healthy: {derived.status.healthyServices} | Degraded: {derived.status.degradedServices} | Down: {derived.status.downServices}</p>
        <p>Active alerts: {derived.status.activeAlerts}</p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Services</h2>
          <ul>
            {state.snapshots.map((snapshot) => (
              <li key={snapshot.serviceId}>
                <strong>{snapshot.serviceName}</strong> [{snapshot.health}] - {snapshot.latencyMs}ms, {(snapshot.errorRate * 100).toFixed(1)}% errors
              </li>
            ))}
          </ul>
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Alerts</h2>
          {derived.alerts.length === 0 ? (
            <p>No active alerts.</p>
          ) : (
            <ul>
              {derived.alerts.map((alert) => (
                <li key={alert.alertId}>
                  <strong>[{alert.level}]</strong> {alert.serviceName}: {alert.reason}
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Incident Groups</h2>
          <ul>
            {state.incidents.map((incident) => (
              <li key={incident.incidentId}>
                {incident.serviceName} - {incident.fingerprint} ({incident.count} events, {incident.severity})
              </li>
            ))}
          </ul>
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Recent Logs</h2>
          <ul>
            {state.logs.slice(-12).map((log) => (
              <li key={log.id}>
                {log.timestampIso} [{log.level}] {log.serviceName} - {log.message}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
