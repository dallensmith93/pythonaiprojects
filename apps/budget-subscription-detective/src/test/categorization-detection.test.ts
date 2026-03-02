import { describe, expect, it } from 'vitest'

import {
  DEFAULT_RULES,
  categorizeTransaction,
  categorizeTransactions,
  detectSpendingAnomalies,
  detectSubscriptions,
  type Transaction
} from '../domain'

describe('categorization engine', () => {
  it('categorizes by highest-priority matching rule with reason', () => {
    const tx: Transaction = {
      id: 't1',
      dateIso: '2026-01-01',
      description: 'Netflix Subscription',
      amount: -15.99,
      merchant: 'Netflix'
    }

    const categorized = categorizeTransaction(tx, DEFAULT_RULES)
    expect(categorized.category).toBe('subscriptions')
    expect(categorized.categoryReason).toContain('Matched rule')
  })

  it('falls back when no rule matches', () => {
    const tx: Transaction = {
      id: 't2',
      dateIso: '2026-01-01',
      description: 'Unknown Vendor',
      amount: -9,
      merchant: 'Unknown Vendor'
    }

    const categorized = categorizeTransaction(tx, DEFAULT_RULES)
    expect(categorized.category).toBe('other')
  })
})

describe('subscription and anomaly detection', () => {
  const recurring: Transaction[] = [
    { id: 'a1', dateIso: '2026-01-10', description: 'Spotify', amount: -10.99, merchant: 'Spotify' },
    { id: 'a2', dateIso: '2026-02-10', description: 'Spotify', amount: -10.99, merchant: 'Spotify' },
    { id: 'a3', dateIso: '2026-03-11', description: 'Spotify', amount: -10.99, merchant: 'Spotify' },
    { id: 'a4', dateIso: '2026-01-05', description: 'Trader Grocery', amount: -120, merchant: 'Trader Market' },
    { id: 'a5', dateIso: '2026-02-05', description: 'Trader Grocery', amount: -110, merchant: 'Trader Market' },
    { id: 'a6', dateIso: '2026-03-05', description: 'Trader Grocery', amount: -920, merchant: 'Trader Market' }
  ]

  const categorized = categorizeTransactions(recurring, DEFAULT_RULES)

  it('detects recurring subscriptions', () => {
    const subs = detectSubscriptions(categorized)
    expect(subs.some((s) => s.merchant.toLowerCase().includes('spotify'))).toBe(true)
  })

  it('detects merchant outlier anomalies', () => {
    const anomalies = detectSpendingAnomalies(categorized)
    expect(anomalies.some((a) => a.merchant.toLowerCase().includes('trader'))).toBe(true)
  })
})

