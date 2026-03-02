export type LogLevel = 'info' | 'warn' | 'error'

export interface LogEvent {
  id: string
  serviceId: string
  serviceName: string
  level: LogLevel
  message: string
  fingerprint: string
  timestampIso: string
}

export function ingestSyntheticLogs(checkTime: string): LogEvent[] {
  const t = Date.parse(checkTime)

  return [
    {
      id: `log-${t}-1`,
      serviceId: 'svc-auth',
      serviceName: 'Auth API',
      level: 'warn',
      message: 'JWT validation latency above baseline.',
      fingerprint: 'auth-latency-jwt',
      timestampIso: new Date(t - 10_000).toISOString()
    },
    {
      id: `log-${t}-2`,
      serviceId: 'svc-billing',
      serviceName: 'Billing API',
      level: 'error',
      message: 'Charge sync timeout from upstream provider.',
      fingerprint: 'billing-timeout-charge-sync',
      timestampIso: new Date(t - 7_000).toISOString()
    },
    {
      id: `log-${t}-3`,
      serviceId: 'svc-billing',
      serviceName: 'Billing API',
      level: 'error',
      message: 'Charge sync timeout from upstream provider.',
      fingerprint: 'billing-timeout-charge-sync',
      timestampIso: new Date(t - 3_000).toISOString()
    },
    {
      id: `log-${t}-4`,
      serviceId: 'svc-webhook',
      serviceName: 'Webhook Worker',
      level: 'info',
      message: 'Webhook queue depth normal.',
      fingerprint: 'webhook-queue-normal',
      timestampIso: new Date(t - 2_000).toISOString()
    }
  ]
}
