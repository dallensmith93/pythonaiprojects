import type { SimulationState } from './sim_engine'

export type AlertLevel = 'critical' | 'high' | 'medium' | 'low'

export interface AlertEvent {
  id: string
  tick: number
  level: AlertLevel
  title: string
  message: string
  source: string
}

export function buildAlerts(state: SimulationState): AlertEvent[] {
  const alerts: AlertEvent[] = []

  if (state.severity >= 5) {
    alerts.push({
      id: `sev5-${state.tick}`,
      tick: state.tick,
      level: 'critical',
      title: 'Critical Threat Active',
      message: 'Exploit activity is still active and business risk is increasing.',
      source: 'threat-intel'
    })
  }

  if (state.containment < 35 && state.tick >= 2) {
    alerts.push({
      id: `containment-${state.tick}`,
      tick: state.tick,
      level: 'high',
      title: 'Containment Gap',
      message: 'Containment remains below expected control threshold.',
      source: 'soc-analytics'
    })
  }

  if (state.customerImpact >= 50) {
    alerts.push({
      id: `impact-${state.tick}`,
      tick: state.tick,
      level: 'high',
      title: 'Customer Impact Escalating',
      message: 'Customer-facing degradation is becoming visible.',
      source: 'experience-monitor'
    })
  }

  if (state.alertNoise >= 60) {
    alerts.push({
      id: `noise-${state.tick}`,
      tick: state.tick,
      level: 'medium',
      title: 'Alert Fatigue Risk',
      message: 'Noise is high; prioritize key indicators.',
      source: 'siem'
    })
  }

  if (state.status === 'resolved') {
    alerts.push({
      id: `resolved-${state.tick}`,
      tick: state.tick,
      level: 'low',
      title: 'Incident Resolved',
      message: 'Recovery targets achieved and incident can move to postmortem.',
      source: 'incident-commander'
    })
  }

  if (state.status === 'failed') {
    alerts.push({
      id: `failed-${state.tick}`,
      tick: state.tick,
      level: 'critical',
      title: 'Incident Escalated to Failure',
      message: 'Simulation reached failure threshold before recovery objectives.',
      source: 'incident-commander'
    })
  }

  return alerts
}
