export type ServiceHealth = 'healthy' | 'degraded' | 'down'

export interface ServiceSnapshot {
  serviceId: string
  serviceName: string
  latencyMs: number
  errorRate: number
  uptimePercent: number
  requestsPerMin: number
  health: ServiceHealth
  checkedAtIso: string
}

export const DEFAULT_SERVICES = [
  { serviceId: 'svc-auth', serviceName: 'Auth API' },
  { serviceId: 'svc-billing', serviceName: 'Billing API' },
  { serviceId: 'svc-webhook', serviceName: 'Webhook Worker' }
]

export function evaluateHealth(latencyMs: number, errorRate: number): ServiceHealth {
  if (errorRate >= 0.12 || latencyMs >= 1800) return 'down'
  if (errorRate >= 0.04 || latencyMs >= 700) return 'degraded'
  return 'healthy'
}

export function runHealthChecks(seed = Date.now()): ServiceSnapshot[] {
  const pseudo = (value: number) => {
    const x = Math.sin(value) * 10000
    return x - Math.floor(x)
  }

  return DEFAULT_SERVICES.map((service, idx) => {
    const base = seed + idx * 111
    const latencyMs = Math.round(120 + pseudo(base) * 1400)
    const errorRate = Number((pseudo(base + 7) * 0.15).toFixed(3))
    const uptimePercent = Number((99.1 + pseudo(base + 13) * 0.9).toFixed(2))
    const requestsPerMin = Math.round(200 + pseudo(base + 19) * 1200)

    return {
      ...service,
      latencyMs,
      errorRate,
      uptimePercent,
      requestsPerMin,
      health: evaluateHealth(latencyMs, errorRate),
      checkedAtIso: new Date(seed).toISOString()
    }
  })
}
