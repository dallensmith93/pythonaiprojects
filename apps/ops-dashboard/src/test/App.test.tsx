import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OpsDashboardPage } from '../features/dashboard/OpsDashboardPage'

describe('OpsDashboardPage', () => {
  it('renders services and alerts sections', () => {
    render(<OpsDashboardPage />)
    expect(screen.getByRole('heading', { name: 'Personal Ops Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Alerts' })).toBeInTheDocument()
  })
})
