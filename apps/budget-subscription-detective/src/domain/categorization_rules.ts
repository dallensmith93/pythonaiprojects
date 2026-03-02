import type { Transaction } from './csv_import'

export type Category =
  | 'groceries'
  | 'transport'
  | 'rent'
  | 'utilities'
  | 'entertainment'
  | 'subscriptions'
  | 'income'
  | 'other'

export interface CategoryRule {
  id: string
  name: string
  category: Category
  keywords: string[]
  amountMin?: number
  amountMax?: number
  priority: number
}

export interface CategorizedTransaction extends Transaction {
  category: Category
  categoryReason: string
}

export const DEFAULT_RULES: CategoryRule[] = [
  { id: 'r-rent', name: 'Rent payment', category: 'rent', keywords: ['rent', 'apartment'], priority: 100 },
  { id: 'r-income', name: 'Income', category: 'income', keywords: ['payroll', 'salary', 'deposit'], priority: 90, amountMin: 0 },
  { id: 'r-grocery', name: 'Grocery stores', category: 'groceries', keywords: ['market', 'grocery', 'trader'], priority: 80 },
  { id: 'r-sub', name: 'Subscriptions', category: 'subscriptions', keywords: ['netflix', 'spotify', 'prime', 'subscription'], priority: 75 },
  { id: 'r-transport', name: 'Transport', category: 'transport', keywords: ['uber', 'lyft', 'gas', 'fuel'], priority: 70 },
  { id: 'r-utility', name: 'Utilities', category: 'utilities', keywords: ['electric', 'water', 'internet', 'phone'], priority: 65 }
]

function matchesRule(transaction: Transaction, rule: CategoryRule): boolean {
  const text = `${transaction.description} ${transaction.merchant}`.toLowerCase()
  const keywordMatch = rule.keywords.some((keyword) => text.includes(keyword.toLowerCase()))
  const minOk = rule.amountMin === undefined || transaction.amount >= rule.amountMin
  const maxOk = rule.amountMax === undefined || transaction.amount <= rule.amountMax
  return keywordMatch && minOk && maxOk
}

export function categorizeTransaction(transaction: Transaction, rules: CategoryRule[]): CategorizedTransaction {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority)
  const hit = sorted.find((rule) => matchesRule(transaction, rule))

  if (!hit) {
    return {
      ...transaction,
      category: transaction.amount > 0 ? 'income' : 'other',
      categoryReason: 'No rule matched; default fallback applied.'
    }
  }

  return {
    ...transaction,
    category: hit.category,
    categoryReason: `Matched rule: ${hit.name}`
  }
}

export function categorizeTransactions(transactions: Transaction[], rules: CategoryRule[]): CategorizedTransaction[] {
  return transactions.map((transaction) => categorizeTransaction(transaction, rules))
}
