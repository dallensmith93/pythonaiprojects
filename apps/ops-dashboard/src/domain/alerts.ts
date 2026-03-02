import type { ServiceSnapshot } from './health_checks'
import type { IncidentGroup } from './incident_grouping'

export interface AlertEvent {
  alertId: string
  serviceId: string
  serviceName: string
  level: 'warning' | 'critical'
  reason: string
  source: 'health' | 'incident'
}

export function generateAlerts(snapshots: ServiceSnapshot[], incidents: IncidentGroup[]): AlertEvent[] {
  const alerts: AlertEvent[] = []

  for (const snapshot of snapshots) {
    if (snapshot.health === 'degraded') {
      alerts.push({
        alertId: `alert-health-${snapshot.serviceId}`,
        serviceId: snapshot.serviceId,
        serviceName: snapshot.serviceName,
        level: 'warning',
        reason: `Service degraded: latency ${snapshot.latencyMs}ms, error rate ${(snapshot.errorRate * 100).toFixed(1)}%.`,
        source: 'health'
      })
    }

    if (snapshot.health === 'down') {
      alerts.push({
        alertId: `alert-health-${snapshot.serviceId}`,
        serviceId: snapshot.serviceId,
        serviceName: snapshot.serviceName,
        level: 'critical',
        reason: `Service down: latency ${snapshot.latencyMs}ms, error rate ${(snapshot.errorRate * 100).toFixed(1)}%.`,
        source: 'health'
      })
    }
  }

  for (const incident of incidents) {
    if (incident.count < 2 && incident.severity === 'warning') {
      continue
    }

    alerts.push({
      alertId: `alert-inc-${incident.incidentId}`,
      serviceId: incident.serviceId,
      serviceName: incident.serviceName,
      level: incident.severity,
      reason: `${incident.count} related log events grouped (${incident.fingerprint}).`,
      source: 'incident'
    })
  }

  const dedup = new Map<string, AlertEvent>()
  for (const alert of alerts) {
    const key = `${alert.serviceId}:${alert.source}:${alert.level}`
    if (!dedup.has(key)) dedup.set(key, alert)
  }

  return [...dedup.values()]
}
