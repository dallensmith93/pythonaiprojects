import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RepurposerStudio } from '../features/RepurposerStudio'

describe('RepurposerStudio', () => {
  it('renders source input and generation button', () => {
    render(<RepurposerStudio />)

    expect(screen.getByRole('heading', { name: 'Content Repurposer' })).toBeInTheDocument()
    expect(screen.getByLabelText('source-content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate Variants' })).toBeInTheDocument()
  })

  it('generates variants from source content', () => {
    render(<RepurposerStudio />)

    fireEvent.click(screen.getByRole('button', { name: 'Generate Variants' }))

    expect(screen.getByText(/variants \(/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Hook:/i).length).toBeGreaterThan(0)
  })
})
