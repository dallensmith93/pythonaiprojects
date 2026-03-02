import type { AlertEvent } from './alerts'
import type { ServiceSnapshot } from './health_checks'

export interface StatusSummary {
  overall: 'operational' | 'degraded' | 'major_outage'
  healthyServices: number
  degradedServices: number
  downServices: number
  activeAlerts: number
}

export function buildStatusSummary(snapshots: ServiceSnapshot[], alerts: AlertEvent[]): StatusSummary {
  const healthyServices = snapshots.filter((snapshot) => snapshot.health === 'healthy').length
  const degradedServices = snapshots.filter((snapshot) => snapshot.health === 'degraded').length
  const downServices = snapshots.filter((snapshot) => snapshot.health === 'down').length

  const overall: StatusSummary['overall'] =
    downServices > 0 ? 'major_outage' :
    degradedServices > 0 ? 'degraded' :
    'operational'

  return {
    overall,
    healthyServices,
    degradedServices,
    downServices,
    activeAlerts: alerts.length
  }
}
