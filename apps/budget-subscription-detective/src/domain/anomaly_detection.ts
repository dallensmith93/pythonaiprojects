import type { CategorizedTransaction } from './categorization_rules'

export interface SubscriptionCandidate {
  merchant: string
  averageAmount: number
  occurrences: number
  averageDayGap: number
  confidence: number
}

export interface SpendingAnomaly {
  transactionId: string
  merchant: string
  amount: number
  baselineAmount: number
  zScoreApprox: number
  reason: string
}

function daysBetween(isoA: string, isoB: string): number {
  const a = new Date(isoA).getTime()
  const b = new Date(isoB).getTime()
  return Math.abs(a - b) / (1000 * 60 * 60 * 24)
}

export function detectSubscriptions(transactions: CategorizedTransaction[]): SubscriptionCandidate[] {
  const byMerchant = new Map<string, CategorizedTransaction[]>()

  for (const tx of transactions.filter((entry) => entry.amount < 0)) {
    const key = tx.merchant.toLowerCase()
    byMerchant.set(key, [...(byMerchant.get(key) ?? []), tx])
  }

  const candidates: SubscriptionCandidate[] = []

  for (const [merchantKey, list] of byMerchant.entries()) {
    if (list.length < 3) continue

    const sorted = [...list].sort((a, b) => a.dateIso.localeCompare(b.dateIso))
    const absAmounts = sorted.map((entry) => Math.abs(entry.amount))
    const avgAmount = absAmounts.reduce((sum, value) => sum + value, 0) / absAmounts.length

    const gaps: number[] = []
    for (let i = 1; i < sorted.length; i += 1) {
      gaps.push(daysBetween(sorted[i - 1].dateIso, sorted[i].dateIso))
    }
    const avgGap = gaps.reduce((sum, value) => sum + value, 0) / gaps.length

    const amountStable = absAmounts.every((value) => Math.abs(value - avgAmount) / avgAmount < 0.2)
    const cadenceLikely = avgGap >= 20 && avgGap <= 40

    if (amountStable && cadenceLikely) {
      const confidence = Math.round((0.6 + Math.min(0.4, (sorted.length - 3) * 0.1)) * 100)
      candidates.push({
        merchant: sorted[0].merchant,
        averageAmount: Math.round(avgAmount * 100) / 100,
        occurrences: sorted.length,
        averageDayGap: Math.round(avgGap * 10) / 10,
        confidence
      })
    }
  }

  return candidates.sort((a, b) => b.confidence - a.confidence)
}

export function detectSpendingAnomalies(transactions: CategorizedTransaction[]): SpendingAnomaly[] {
  const expenseTx = transactions.filter((entry) => entry.amount < 0)
  const byMerchant = new Map<string, CategorizedTransaction[]>()

  for (const tx of expenseTx) {
    const key = tx.merchant.toLowerCase()
    byMerchant.set(key, [...(byMerchant.get(key) ?? []), tx])
  }

  const anomalies: SpendingAnomaly[] = []

  for (const list of byMerchant.values()) {
    if (list.length < 3) continue

    const absAmounts = list.map((entry) => Math.abs(entry.amount))
    const baseline = absAmounts.reduce((sum, value) => sum + value, 0) / absAmounts.length
    const variance = absAmounts.reduce((sum, value) => sum + (value - baseline) ** 2, 0) / absAmounts.length
    const stdDev = Math.sqrt(variance) || 1

    for (const tx of list) {
      const amount = Math.abs(tx.amount)
      const z = (amount - baseline) / stdDev
      const relativeSpike = amount >= baseline * 1.75 && amount - baseline >= 50
      if (z >= 2.25 || relativeSpike) {
        anomalies.push({
          transactionId: tx.id,
          merchant: tx.merchant,
          amount: tx.amount,
          baselineAmount: Math.round(baseline * 100) / 100,
          zScoreApprox: Math.round(z * 100) / 100,
          reason: `Amount is unusually high vs merchant baseline (${Math.round(z * 10) / 10}?).`
        })
      }
    }
  }

  return anomalies
}

