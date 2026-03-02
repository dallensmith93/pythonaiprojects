export interface Transaction {
  id: string
  dateIso: string
  description: string
  amount: number
  merchant: string
}

export function parseCsvTransactions(csv: string): Transaction[] {
  const lines = csv.trim().split(/\r?\n/)
  if (lines.length <= 1) return []

  const rows = lines.slice(1)
  return rows
    .map((line, index) => {
      const [dateIso, description, amountRaw, merchant] = line.split(',').map((part) => part.trim())
      const amount = Number(amountRaw)
      if (!dateIso || !description || Number.isNaN(amount)) return null

      return {
        id: `tx-${index}-${dateIso}`,
        dateIso,
        description,
        amount,
        merchant: merchant || description
      } as Transaction
    })
    .filter((entry): entry is Transaction => entry !== null)
}
