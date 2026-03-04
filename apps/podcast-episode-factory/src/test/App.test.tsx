import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OverviewPanel } from '../features/OverviewPanel'

describe('OverviewPanel', () => {
  it('renders title and core modules', () => {
    render(<OverviewPanel />)
    expect(screen.getByRole('heading', { name: 'Podcast Episode Factory' })).toBeInTheDocument()
    expect(screen.getByText('Core Modules')).toBeInTheDocument()
  })
})
