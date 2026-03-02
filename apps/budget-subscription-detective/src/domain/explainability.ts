import type { CategorizedTransaction } from './categorization_rules'
import type { SpendingAnomaly, SubscriptionCandidate } from './anomaly_detection'

export function explainTransaction(transaction: CategorizedTransaction): string {
  return `${transaction.category.toUpperCase()}: ${transaction.categoryReason}`
}

export function explainSubscription(candidate: SubscriptionCandidate): string {
  return `Recurring charge detected for ${candidate.merchant}: ${candidate.occurrences} charges, avg $${candidate.averageAmount}, every ${candidate.averageDayGap} days (confidence ${candidate.confidence}%).`
}

export function explainAnomaly(anomaly: SpendingAnomaly): string {
  return `${anomaly.merchant} transaction of $${Math.abs(anomaly.amount)} is above baseline $${anomaly.baselineAmount}. ${anomaly.reason}`
}
