import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SpecBuilderStudio } from '../features/SpecBuilderStudio'

describe('SpecBuilderStudio', () => {
  it('renders idea input and generate action', () => {
    render(<SpecBuilderStudio />)
    expect(screen.getByRole('heading', { name: 'Spec Builder' })).toBeInTheDocument()
    expect(screen.getByLabelText('idea-input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate Outputs' })).toBeInTheDocument()
  })

  it('switches tabs and shows API output', () => {
    render(<SpecBuilderStudio />)
    fireEvent.click(screen.getByLabelText('tab-api'))
    expect(screen.getByText(/service/i)).toBeInTheDocument()
  })
})
