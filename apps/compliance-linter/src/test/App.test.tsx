import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ComplianceLinterStudio } from '../features/ComplianceLinterStudio'

describe('ComplianceLinterStudio', () => {
  it('renders editor and rules controls', () => {
    render(<ComplianceLinterStudio />)
    expect(screen.getByRole('heading', { name: 'Compliance Linter' })).toBeInTheDocument()
    expect(screen.getByLabelText('draft-editor')).toBeInTheDocument()
    expect(screen.getByLabelText('rule-maxwords')).toBeInTheDocument()
  })

  it('updates issues after draft edit', () => {
    render(<ComplianceLinterStudio />)
    fireEvent.change(screen.getByLabelText('draft-editor'), { target: { value: 'Short neutral draft with next steps.' } })
    expect(screen.getByText(/Issues \(/i)).toBeInTheDocument()
  })
})
