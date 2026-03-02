import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BudgetDetectivePage } from '../features/budget/BudgetDetectivePage'

describe('BudgetDetectivePage', () => {
  it('renders key sections', () => {
    render(<BudgetDetectivePage />)
    expect(screen.getByRole('heading', { name: 'Budget + Subscription Detective' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Transactions' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Rule Editor' })).toBeInTheDocument()
  })
})
