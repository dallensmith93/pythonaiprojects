import type { CategoryRule, Transaction } from '../../domain'

export interface BudgetPersistedData {
  transactions: Transaction[]
  rules: CategoryRule[]
}

const STORAGE_KEY = 'budget-subscription-detective/v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function loadBudgetData(defaultData: BudgetPersistedData): BudgetPersistedData {
  if (!hasWindow()) return defaultData

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw) as BudgetPersistedData
    return {
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : defaultData.transactions,
      rules: Array.isArray(parsed.rules) ? parsed.rules : defaultData.rules
    }
  } catch {
    return defaultData
  }
}

export function saveBudgetData(data: BudgetPersistedData): void {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
