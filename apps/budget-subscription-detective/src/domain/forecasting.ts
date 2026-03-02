import type { CategorizedTransaction } from './categorization_rules'

export interface ForecastPoint {
  month: string
  projectedNet: number
  projectedExpenses: number
  projectedIncome: number
}

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7)
}

export function forecastCashFlow(transactions: CategorizedTransaction[], months = 3): ForecastPoint[] {
  const monthly = new Map<string, { income: number; expense: number }>()

  for (const tx of transactions) {
    const key = monthKey(tx.dateIso)
    const current = monthly.get(key) ?? { income: 0, expense: 0 }
    if (tx.amount >= 0) {
      current.income += tx.amount
    } else {
      current.expense += Math.abs(tx.amount)
    }
    monthly.set(key, current)
  }

  const keys = [...monthly.keys()].sort()
  if (keys.length === 0) return []

  const avgIncome = keys.reduce((sum, key) => sum + (monthly.get(key)?.income ?? 0), 0) / keys.length
  const avgExpense = keys.reduce((sum, key) => sum + (monthly.get(key)?.expense ?? 0), 0) / keys.length

  const last = keys[keys.length - 1]
  const [yearRaw, monthRaw] = last.split('-').map(Number)

  const points: ForecastPoint[] = []
  for (let i = 1; i <= months; i += 1) {
    const d = new Date(Date.UTC(yearRaw, monthRaw - 1 + i, 1))
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
    const projectedIncome = Math.round(avgIncome * 100) / 100
    const projectedExpenses = Math.round(avgExpense * 100) / 100
    points.push({
      month,
      projectedIncome,
      projectedExpenses,
      projectedNet: Math.round((projectedIncome - projectedExpenses) * 100) / 100
    })
  }

  return points
}
