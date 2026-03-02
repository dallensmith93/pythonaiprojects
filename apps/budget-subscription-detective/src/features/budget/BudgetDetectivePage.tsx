'use client'

import React, { useMemo, useState } from 'react'

import { budgetActions, selectBudgetDerived, useBudgetStore } from '../state/budgetStore'
import { explainAnomaly, explainSubscription, explainTransaction, parseCsvTransactions, type Category, type CategoryRule } from '../../domain'

const categories: Category[] = ['groceries', 'transport', 'rent', 'utilities', 'entertainment', 'subscriptions', 'income', 'other']

export function BudgetDetectivePage() {
  const state = useBudgetStore((s) => s)
  const derived = useMemo(() => selectBudgetDerived(state), [state])
  const [csvInput, setCsvInput] = useState('date,description,amount,merchant\n2026-04-01,Spotify Subscription,-10.99,Spotify')
  const [ruleName, setRuleName] = useState('Coffee shops')
  const [ruleKeyword, setRuleKeyword] = useState('coffee')
  const [ruleCategory, setRuleCategory] = useState<Category>('entertainment')

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1200 }}>
      <h1>Budget + Subscription Detective</h1>
      <p>Categorize transactions, detect recurring subscriptions, flag anomalies, and project cash flow.</p>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <h2>Import CSV</h2>
        <textarea
          value={csvInput}
          onChange={(event) => setCsvInput(event.target.value)}
          rows={4}
          style={{ width: '100%' }}
        />
        <div style={{ marginTop: 8 }}>
          <button
            type='button'
            onClick={() => {
              const parsed = parseCsvTransactions(csvInput)
              budgetActions.importTransactions([...state.transactions, ...parsed])
            }}
          >
            Import Rows
          </button>
          <button type='button' onClick={() => budgetActions.resetDefaults()} style={{ marginLeft: 8 }}>
            Reset Sample Data
          </button>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Transactions</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Date</th>
                  <th style={{ textAlign: 'left' }}>Merchant</th>
                  <th style={{ textAlign: 'left' }}>Amount</th>
                  <th style={{ textAlign: 'left' }}>Category</th>
                  <th style={{ textAlign: 'left' }}>Why</th>
                </tr>
              </thead>
              <tbody>
                {derived.categorized.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.dateIso}</td>
                    <td>{tx.merchant}</td>
                    <td>{tx.amount.toFixed(2)}</td>
                    <td>{tx.category}</td>
                    <td>{explainTransaction(tx)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Rule Editor</h2>
          <label>
            Name
            <input value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
          </label>
          <label>
            Keyword
            <input value={ruleKeyword} onChange={(event) => setRuleKeyword(event.target.value)} />
          </label>
          <label>
            Category
            <select value={ruleCategory} onChange={(event) => setRuleCategory(event.target.value as Category)}>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <button
            type='button'
            onClick={() => {
              const id = `custom-${Date.now()}`
              const newRule: CategoryRule = {
                id,
                name: ruleName,
                category: ruleCategory,
                keywords: [ruleKeyword],
                priority: 50
              }
              budgetActions.addRule(newRule)
            }}
          >
            Add Rule
          </button>

          <h3>Rules</h3>
          <ul>
            {state.rules.map((rule) => (
              <li key={rule.id}>{rule.name} {"->"} {rule.category} ({rule.keywords.join(', ')})</li>
            ))}
          </ul>
        </section>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Category Spend Chart</h2>
          <ul>
            {Object.entries(derived.categoryTotals).map(([category, total]) => (
              <li key={category}>{category}: ${total.toFixed(2)}</li>
            ))}
          </ul>
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Forecast Trend</h2>
          <ul>
            {derived.forecast.map((point) => (
              <li key={point.month}>{point.month}: net ${point.projectedNet.toFixed(2)} (income ${point.projectedIncome.toFixed(2)} / expenses ${point.projectedExpenses.toFixed(2)})</li>
            ))}
          </ul>
        </section>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Detected Subscriptions</h2>
          {derived.subscriptions.length === 0 ? (
            <p>No recurring subscriptions detected yet.</p>
          ) : (
            <ul>
              {derived.subscriptions.map((sub) => (
                <li key={sub.merchant}>{explainSubscription(sub)}</li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Anomalies</h2>
          {derived.anomalies.length === 0 ? (
            <p>No anomalies currently detected.</p>
          ) : (
            <ul>
              {derived.anomalies.map((anomaly) => (
                <li key={anomaly.transactionId}>{explainAnomaly(anomaly)}</li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}

