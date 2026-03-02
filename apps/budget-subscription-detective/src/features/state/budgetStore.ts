import { useSyncExternalStore } from 'react'

import {
  DEFAULT_RULES,
  categorizeTransactions,
  detectSpendingAnomalies,
  detectSubscriptions,
  forecastCashFlow,
  type CategoryRule,
  type CategorizedTransaction,
  type ForecastPoint,
  type SpendingAnomaly,
  type SubscriptionCandidate,
  type Transaction
} from '../../domain'
import { loadBudgetData, saveBudgetData } from '../persistence/storage'

export interface BudgetState {
  transactions: Transaction[]
  rules: CategoryRule[]
}

const seedTransactions: Transaction[] = [
  { id: 'tx-1', dateIso: '2026-01-03', description: 'Payroll Deposit', amount: 3200, merchant: 'Acme Payroll' },
  { id: 'tx-2', dateIso: '2026-01-05', description: 'Apartment Rent', amount: -1450, merchant: 'City Apartments' },
  { id: 'tx-3', dateIso: '2026-01-07', description: 'Trader Grocery', amount: -132.8, merchant: 'Trader Market' },
  { id: 'tx-4', dateIso: '2026-01-11', description: 'Netflix Subscription', amount: -15.99, merchant: 'Netflix' },
  { id: 'tx-5', dateIso: '2026-02-11', description: 'Netflix Subscription', amount: -15.99, merchant: 'Netflix' },
  { id: 'tx-6', dateIso: '2026-03-11', description: 'Netflix Subscription', amount: -15.99, merchant: 'Netflix' },
  { id: 'tx-7', dateIso: '2026-03-19', description: 'Trader Grocery', amount: -389.42, merchant: 'Trader Market' }
]

let state: BudgetState = loadBudgetData({
  transactions: seedTransactions,
  rules: DEFAULT_RULES
})

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(): void {
  saveBudgetData({ transactions: state.transactions, rules: state.rules })
}

export const budgetActions = {
  hydrate() {
    state = loadBudgetData({ transactions: seedTransactions, rules: DEFAULT_RULES })
    emit()
  },
  importTransactions(transactions: Transaction[]) {
    state = { ...state, transactions }
    persist()
    emit()
  },
  addRule(rule: CategoryRule) {
    state = { ...state, rules: [...state.rules, rule] }
    persist()
    emit()
  },
  updateRule(ruleId: string, patch: Partial<CategoryRule>) {
    state = {
      ...state,
      rules: state.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...patch } : rule))
    }
    persist()
    emit()
  },
  resetDefaults() {
    state = { transactions: seedTransactions, rules: DEFAULT_RULES }
    persist()
    emit()
  }
}

let hydrated = false

export function useBudgetStore<T>(selector: (state: BudgetState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      if (!hydrated && typeof window !== 'undefined') {
        hydrated = true
        budgetActions.hydrate()
      }
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state)
  )
}

export interface BudgetDerivedView {
  categorized: CategorizedTransaction[]
  subscriptions: SubscriptionCandidate[]
  anomalies: SpendingAnomaly[]
  forecast: ForecastPoint[]
  categoryTotals: Record<string, number>
}

export function selectBudgetDerived(current: BudgetState): BudgetDerivedView {
  const categorized = categorizeTransactions(current.transactions, current.rules)
  const subscriptions = detectSubscriptions(categorized)
  const anomalies = detectSpendingAnomalies(categorized)
  const forecast = forecastCashFlow(categorized)

  const categoryTotals: Record<string, number> = {}
  for (const tx of categorized) {
    if (tx.amount >= 0) continue
    categoryTotals[tx.category] = (categoryTotals[tx.category] ?? 0) + Math.abs(tx.amount)
  }

  return { categorized, subscriptions, anomalies, forecast, categoryTotals }
}
