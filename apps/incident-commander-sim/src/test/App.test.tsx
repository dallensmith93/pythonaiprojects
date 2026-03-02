import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IncidentSimulatorPage } from '../features/simulator/IncidentSimulatorPage'

describe('IncidentSimulatorPage', () => {
  it('renders key panels', () => {
    render(<IncidentSimulatorPage />)
    expect(screen.getByRole('heading', { name: 'Incident Commander Simulator' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Action Panel' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Timeline' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Scoring' })).toBeInTheDocument()
  })
})
